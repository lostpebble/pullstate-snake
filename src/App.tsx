import React from "react";
import "./App.css";
import { Stage } from "./Stage";
import { useStoreState } from "pullstate";
import { EGameState, GameStore } from "./state/GameStore";
import { u_reset, u_togglePause, uc_setSpeed } from "./state/GameUpdaters";
import ReactHotkeys from "react-hot-keys";

const App: React.FC = () => {
  const [gameState, points] = useStoreState(GameStore, s => [s.gameState, s.stage.points]);

  return (
    <div className="App">
      <header className="App-header">
        <button
          className={"reset"}
          onClick={() => {
            GameStore.update(u_reset);
          }}
        >
          Reset
        </button>
        <p>Pullstate Snake Game</p>
        <ReactHotkeys keyName="space" onKeyDown={() => GameStore.update(u_togglePause)} />
        <button onClick={() => GameStore.update(u_togglePause)}>
          {gameState === EGameState.PAUSED ? "Resume (space)" : "Pause (space)"}
        </button>
        <div className={"score"}>
          <span className={"text"}>Score</span>
          <span className={"points"}>{points}</span>
        </div>
      </header>
      <Stage />
      <header className="App-header">
        <p>Set Speed Interval</p>
        <div className={"speed-buttons"}>
          {[200, 100, 50].map(speed => <button onClick={() => GameStore.update(uc_setSpeed(speed))}>{speed}</button>)}
        </div>
      </header>
    </div>
  );
};

export default App;
