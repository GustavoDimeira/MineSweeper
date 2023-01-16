import React, { ReactNode, useEffect, useState } from 'react';
import Board from './mineSweeperBoard';

import './mineSweeperHeader.css';

let interval: any;

function MineSweeper() {
  const [isRunning, startAndStop] = useState<boolean>(false);
  const [hasLoste, changeLose] = useState<boolean>(false);
  const [haswin, changeWin] = useState<boolean>(false);
  const [isResetarting, changeRestar] = useState<boolean>(false);

  const [timer, updateTimer] = useState<number>(0);
  const [timerString, updateTimerString] = useState<string>("0:0");
  const [winList, changeWinList] = useState<number[]>([]);

  const [headerWidth, changeWidth] = useState<string>("0");

  const reSize = () => {
    const { width }: { width: number } = window.screen;
    let percentage: number = 0
    if (width < 401) {
      percentage = 0.85;
    } else if (width < 551) {
      percentage = 0.85;
    } else if (width < 751) {
      percentage = 0.65;
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
        const order = [...prev, (timer / 10)];
        return order.sort();
      });
    }
    const temp: string[] = (timer / 10).toString().split(".");
    updateTimerString(`${temp[0]}:${temp[1] ? temp[1] : 0}`);
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
            defaultValue={"LeaderBoard"}
            className={"leaderBoard"}
          >
            <option
              key={-1}
            >
              Leader Board
            </option>
            {winList.map((time, i): ReactNode => {
              return (
                <option
                  key={i}
                >
                  {`${(time / 10).toString().split(".")[0]}:${(time / 10).toString().split(".")[1] ? Math.round((time / 10)).toString().split(".")[1] : 0}`}
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
      {(haswin || hasLoste) && <div
        className={`endGame ${haswin ? "win" : "lost"}`}
      >
        {
          haswin ? (
            <div>
              "You Win!"
            </div>
          ) : hasLoste && "You Lose"
        }
      </div>}
      <Board bombs={4} cells={8} isRunning={startAndStop} lose={changeLose} win={changeWin} isReseting={isResetarting} triggers={[haswin, hasLoste]} />
    </main>
  );
}

export default MineSweeper;
