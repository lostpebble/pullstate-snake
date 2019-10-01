import { TUpdateFunction } from "pullstate";
import isEqual from "fast-deep-equal";
import { EDirection, EGameState, EItemType, IGameStore, IItem, TPosition } from "./GameStore";
import { createStage, randomPosition } from "./GameStateHelpers";

type TGameUpdater = TUpdateFunction<IGameStore>;

const itemCreateChance = 0.25;

export const u_rollAndAddRandomItem: TGameUpdater = (s, o) => {
  if (itemCreateChance >= Math.random()) {
    let pos: TPosition = randomPosition(o.stage.width, o.stage.height);

    while (o.stage.snake.some(snakePos => isEqual(snakePos, pos))) {
      pos = randomPosition(o.stage.width, o.stage.height);
    }

    const item: IItem = {
      type: EItemType.apple,
      pos,
      created: o.stage.curFrame,
      lifetime: 20,
      value: 1,
      digestionValue: 1,
    };

    if (Math.random() > 0.5) {
      item.type = EItemType.banana;
      item.value = 3;
      item.digestionValue = 2;
    }

    s.stage.items.push(item);
  }
};

export const u_nextStep: TGameUpdater = (s, o) => {
  const [x, y] = o.stage.snake[0];
  let nextPosition: [number, number];

  switch (o.stage.direction) {
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

    o.stage.items.forEach(item => {
      if (isEqual(item.pos, nextPosition)) {
        s.stage.points += item.value;
        s.stage.digestion += item.digestionValue;
      } else if (item.created + item.lifetime > newFrame) {
        keepItems.push(item);
      }
    });

    s.stage.items = keepItems;
    s.stage.curFrame = newFrame;
  }
};

export const u_reset: TGameUpdater = (s, o) => {
  s.stage = createStage(o.stage.width, o.stage.height);
  s.gameState = EGameState.RUNNING;
};

export const uc_changeDirection = (direction: EDirection): TGameUpdater => s => {
  s.stage.direction = direction;
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
