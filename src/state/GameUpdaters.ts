import { TUpdateFunction } from "pullstate";
import isEqual from "fast-deep-equal";
import { EDirection, EGameState, EItemType, IGameStore, IItem, } from "./GameStore";
import { createStage, randomPosition } from "./GameStateHelpers";

type TGameUpdater = TUpdateFunction<IGameStore>;

export const u_addRandomItem: TGameUpdater = (s, o) => {
  let pos: [number, number] = randomPosition(o.stage.width - 1, o.stage.height - 1);

  while (o.stage.snake.some(snakeBlockPos => isEqual(pos, snakeBlockPos))) {
    pos = randomPosition(o.stage.width, o.stage.height);
  }

  let item: IItem = {
    type: EItemType.apple,
    lifetime: 20,
    created: o.stage.curFrame,
    pos: pos,
    points: 1,
  };

  if (Math.random() > 0.5) {
    item.type = EItemType.banana;
    item.points = 3;
  }

  s.stage.items.push(item);
};

const itemCreateChance = 0.1;

export const u_nextStep: TGameUpdater = (s, o) => {
  const [x, y] = o.stage.snake[0];
  let nextPosition: [number, number];

  switch (o.stage.currentDirection) {
    case EDirection.N:
      nextPosition = [x, y - 1];
      break;
    case EDirection.E:
      nextPosition = [x + 1, y];
      break;
    case EDirection.S:
      nextPosition = [x, y + 1];
      break;
    case EDirection.W:
      nextPosition = [x - 1, y];
      break;
  }

  const [nextX, nextY] = nextPosition!;

  if (
    nextX > o.stage.width - 1 ||
    nextX < 0 ||
    nextY > o.stage.height - 1 ||
    nextY < 0 ||
    o.stage.snake.some((snakePos, index) => index !== o.stage.snake.length - 1 && isEqual(snakePos, nextPosition))
  ) {
    // dead
    s.gameState = EGameState.GAME_OVER;
  } else {
    s.stage.snake.unshift(nextPosition!);

    if (o.stage.digestion === 0) {
      s.stage.snake.pop();
    } else {
      s.stage.digestion -= 1;
    }

    const keepItems: IItem[] = [];
    const newFrame = o.stage.curFrame + 1;

    o.stage.items.forEach((item, index) => {
      if (isEqual(item.pos, nextPosition)) {
        s.stage.points += item.points;
        s.stage.digestion += item.type === EItemType.banana ? 2 : 1;
        // no keep
      } else if (item.created + item.lifetime > newFrame) {
        keepItems.push(item);
        // keep
      }
    });

    s.stage.items = keepItems;
    s.stage.curFrame = newFrame;

    if (Math.random() <= itemCreateChance) {
      u_addRandomItem(s, o);
    }
  }
};

export const u_reset: TGameUpdater = (s, o) => {
  s.stage = createStage(o.stage.width, o.stage.height);
  s.gameState = EGameState.RUNNING;
};

export const uc_changeDirection = (direction: EDirection): TGameUpdater => s => {
  s.stage.currentDirection = direction;
};

export const uc_setGameState = (state: EGameState): TGameUpdater => (s, o) => {
  s.gameState = state;
};

export const uc_setSpeed = (speed: number): TGameUpdater => (s, o) => {
  s.speed = speed;
};

export const u_togglePause: TGameUpdater = (s, o) => {
  if (o.gameState === EGameState.RUNNING) {
    s.gameState = EGameState.PAUSED;
  } else {
    s.gameState = EGameState.RUNNING;
  }
};
