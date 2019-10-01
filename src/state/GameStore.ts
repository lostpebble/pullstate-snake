import { Store } from "pullstate";
import { createStage } from "./GameStateHelpers";
import { u_nextStep, u_rollAndAddRandomItem } from "./GameUpdaters";

// [x, y]
export type TPosition = [number, number];

export enum EItemType {
  apple = "apple",
  banana = "banana",
}

export interface IItem {
  type: EItemType;
  pos: TPosition;
  lifetime: number;
  created: number;
  value: number;
  digestionValue: number;
}

export enum EDirection {
  N,
  E,
  S,
  W,
}

export interface IStage {
  items: IItem[];
  snake: TPosition[];
  direction: EDirection;
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
let gameLoopInterval: any = null;

GameStore.subscribe(s => [s.gameState, s.speed], ([state, speed]) => {
  clearInterval(gameLoopInterval);

  if (state === EGameState.RUNNING) {
    gameLoopInterval = setInterval(() => {
      GameStore.update([u_nextStep, u_rollAndAddRandomItem]);
    }, speed as number)
  }
});
