import React, { ReactNode, useEffect, useState } from 'react';
import Board from './mineSweeperBoard';
import Config from './mineSweeperConfig';

import './css/mineSweeperHeader.css';

let interval: any;

function MineSweeper() {
  const [boardInfo, changeInfos] = useState<{ size: number, bombs: number }>({ size: 15, bombs: 40 });

  const [isRunning, startAndStop] = useState<boolean>(false);
  const [hasLoste, changeLose] = useState<boolean>(false);
  const [haswin, changeWin] = useState<boolean>(false);
  const [isResetarting, changeRestar] = useState<boolean>(false);

  const [timer, updateTimer] = useState<number>(0);
  const [timerString, updateTimerString] = useState<string>("0:0");
  const [winList, changeWinList] = useState<string[]>([]);

  const [headerWidth, changeWidth] = useState<string>("0");

  const reSize = () => {
    const { width }: { width: number } = window.screen;
    let percentage: number = 0
    if (width < 401) {
      percentage = 0.85;
    } else if (width < 571) {
      percentage = 0.85;
    } else if (width < 751) {
      percentage = 0.65;
    } else if (width < 900) {
      percentage = 0.60;
    } else {
      percentage = 0.40;
    };
    changeWidth((width * percentage).toString());
  }

  // change the cells size based on the screen width
  useEffect(() => {
    window.addEventListener("resize", reSize);
    reSize();
  }, []);

  const restart = () => {
    changeLose(false);
    changeWin(false);
    changeRestar(!isResetarting);
    updateTimer(0);
  };

  useEffect(() => {
    if (haswin) {
      changeWinList((prev) => {
        const order = [...prev,
          ((boardInfo.size === 10) ? "Easy: " : (boardInfo.size === 15) ? "Medium: " : "Hard: ") + timerString
        ];
        return order.sort();
      });
    }
    const temp: string[] = (timer / 10).toString().split(".");
    updateTimerString(`${temp[0]}:${temp[1] ? temp[1] : 0}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haswin, timer]);

  useEffect(() => {
    if (isRunning) {
      interval = setInterval(() => {
        updateTimer((prev) => prev + 1);
      }, 100)
    } else {
      clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <main className="game">
      <div className="header" style={{ "width": `${headerWidth}px` }}>
        <div>
          <select
            className= { "leaderBoard" }
          >
            <option
              key={-1}
            >
              Leader Board
            </option>
            {winList.map((time, i): ReactNode => {
              return (
                <option
                  key={`temp-${i}`}
                  className={`temp-${i} times`}
                >
                  {`${time}`}
                </option>
              )
            })}
          </select>
        </div>
        <button
          onClick={restart}
          className="restart"
        >
          <p className="emoji">
            {isRunning ? "🤔" : haswin ? "😎" : hasLoste ? "😵" : "😐"}
          </p>
          <p className="text">
            Restart
          </p>
        </button>
        <p className="timer">
          {`Timer: ${timerString}`}
        </p>
      </div>
      {
        (haswin || hasLoste) && <div
          className={`endGame ${haswin ? "win" : "lost"}`}
        >
          {
            haswin ? "You Win!" : hasLoste && "You Lose"
          }
        </div>
      }
      <Config changeInfos={ changeInfos } width={ headerWidth } restart= { restart }/>
      <Board bombs={boardInfo.bombs} cells={boardInfo.size} isRunning={startAndStop} lose={changeLose} win={changeWin} isReseting={isResetarting} triggers={[haswin, hasLoste]} />
    </main>
  );
}

export default MineSweeper;
