import { EDirection, IStage, TPosition } from "./GameStore";

export function createStage(width: number, height: number): IStage {
  return {
    height,
    width,
    items: [],
    snake: [[Math.floor(width / 2), Math.floor(height / 2)]],
    direction: EDirection.N,
    points: 0,
    curFrame: 0,
    digestion: 0,
  };
}

export function randomPosition(width: number, height: number): TPosition {
  return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
}
