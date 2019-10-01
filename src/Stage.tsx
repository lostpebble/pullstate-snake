import { useStoreState } from "pullstate";
import React, { useEffect } from "react";
import ReactHotkeys from "react-hot-keys";
import { EDirection, EGameState, GameStore } from "./state/GameStore";
import { u_rollAndAddRandomItem, u_reset, uc_changeDirection, uc_setGameState } from "./state/GameUpdaters";

export const Stage = () => {
  const [{ snake, items, width, height }, state] = useStoreState(GameStore, s => [s.stage, s.gameState]);

  useEffect(() => {
    GameStore.update([u_rollAndAddRandomItem, uc_setGameState(EGameState.RUNNING)]);
  }, []);

  let snakeHeadRadius = "0";

  if (snake.length > 1) {
    const [prevX, prevY] = snake[1];
    const [x, y] = snake[0];

    if (prevX < x) {
      snakeHeadRadius = `0 5em 5em 0`;
    } else if (prevX > x) {
      snakeHeadRadius = `5em 0 0 5em`;
    } else if (prevY < y) {
      snakeHeadRadius = `0 0 5em 5em`;
    } else {
      snakeHeadRadius = `5em 5em 0 0`;
    }
  }

  return (
    <div className={"stage"}>
      {state === EGameState.GAME_OVER && (
        <div className={"gameover-box"}>
          <span className={"gameover-text"}>Game Over :(</span>
          <ReactHotkeys keyName="enter" onKeyDown={() => GameStore.update(u_reset)} />
          <button onClick={() => GameStore.update(u_reset)}>Try Again (Enter)</button>
        </div>
      )}
      {state === EGameState.PAUSED && <div className={"paused-box"} />}
      <ReactHotkeys keyName={"up"} onKeyDown={() => GameStore.update(uc_changeDirection(EDirection.N))} />
      <ReactHotkeys keyName={"down"} onKeyDown={() => GameStore.update(uc_changeDirection(EDirection.S))} />
      <ReactHotkeys keyName={"right"} onKeyDown={() => GameStore.update(uc_changeDirection(EDirection.E))} />
      <ReactHotkeys keyName={"left"} onKeyDown={() => GameStore.update(uc_changeDirection(EDirection.W))} />
      {snake.map((pos, i) => (
        <div
          key={pos.join(",")}
          className={"snake-block"}
          style={{
            left: `${(pos[0] / width) * 100}%`,
            top: `${(pos[1] / height) * 100}%`,
            width: `calc(${100 / width}% - 2px)`,
            height: `calc(${100 / height}% - 2px)`,
            borderRadius: i === 0 ? snakeHeadRadius : 0,
          }}
        />
      ))}
      {items.map(({ type, pos }) => {
        return (
          <div
            key={pos.join(",")}
            className={`item-block ${type}`}
            style={{
              left: `${(pos[0] / width) * 100}%`,
              top: `${(pos[1] / height) * 100}%`,
              width: `calc(${100 / width}% - 2px)`,
              height: `calc(${100 / height}% - 2px)`,
              borderRadius: "5em",
            }}
          />
        );
      })}
    </div>
  );
};
