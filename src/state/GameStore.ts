import { Store } from "pullstate";
import { createStage } from "./GameStateHelpers";
import { u_nextStep } from "./GameUpdaters";

// [x, y]
type TStageCoordinate = [number, number];

export enum EItemType {
  apple = "apple",
  banana = "banana",
}

export interface IItem {
  type: EItemType;
  pos: TStageCoordinate;
  lifetime: number;
  created: number;
  points: number;
}

export enum EDirection {
  N,
  E,
  S,
  W,
}

export interface IStage {
  items: IItem[];
  snake: TStageCoordinate[];
  currentDirection: EDirection;
  width: number;
  height: number;
  points: number;
  curFrame: number;
  digestion: number;
}

export enum EGameState {
  PAUSED = "PAUSED",
  RUNNING = "RUNNING",
  GAME_OVER = "GAME_OVER",
}

export interface IGameStore {
  stage: IStage;
  gameState: EGameState;
  speed: number;
}

export const GameStore = new Store<IGameStore>({
  stage: createStage(20, 20),
  gameState: EGameState.PAUSED,
  speed: 200,
});

// Game Loop Things
let gameInterval: any = null;

GameStore.subscribe(
  s => [s.gameState, s.speed],
  ([state, speed]) => {
    clearInterval(gameInterval);
    console.log(`setting interval ${state}`);

    if (state === EGameState.RUNNING) {
      gameInterval = setInterval(
        () => {
          GameStore.update([u_nextStep]);
        },
        speed as number
      );
    }
  }
);
