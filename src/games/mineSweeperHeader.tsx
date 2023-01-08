import React, { ReactNode, useEffect, useState } from 'react';
import Board from './mineSweeperBoard';

let interval: any;

function MineSweeper() {
  const [isRunning, startAndStop] = useState<boolean>(false);
  const [hasLoste, changeLoste] = useState<boolean>(false);
  const [haswin, changeWin] = useState<boolean>(false);
  const [isResetarting, changeRestar] = useState<boolean>(false);

  const [timer, updateTimer] = useState<number>(0);
  
  const restart = () => {
    changeLoste(false);
    changeWin(false);
    changeRestar(!isResetarting);
  };

  useEffect(() => {
    if (isRunning) {
      interval = setInterval(() => {
        updateTimer((prev) => prev + 1);
      }, 1000)
    } else {
      clearInterval(interval);
      updateTimer(0);
    }
  }, [isRunning]);

  return (
    <main className="game">
      <header>
        <button
          onClick= { restart }
        >
          <p>
            { isRunning ? '🤔' : haswin ? "😎" : "😵" }
          </p>
          <p>
            Restart
          </p>
        </button>
        <p>
          { timer }
        </p>
      </header>
      <Board bombs={ 55 } cells={ 8 } isRunning={ startAndStop } loste= { changeLoste } win= { changeWin } isResetinga= { isResetarting }/>
    </main>
  );
}

export default MineSweeper;
