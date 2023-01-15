import React, { ReactNode, useEffect, useState } from 'react';

import { MineSweeperClass } from './utilits/mineSweeper.funcs';
import { CellInterface } from './utilits/mineSweeper.interfaces';
import './mineSweeperBoard.css';

const {
  getCells, defineBombs, clickFunction,
  countBombsArround
} = new MineSweeperClass();

function Board({ cells, bombs, isRunning, lose, win, isReseting, triggers }: { cells: number, bombs: number, isRunning: Function, lose: Function, win: Function, isReseting: boolean, triggers: boolean[] }) {
  const [cellsSize, changeSize] = useState<number>(25);
  const [cellsState, changeCellsState] = useState<CellInterface[]>([]);
  const [numberline, numberlineState] = useState<number[]>([]);

  const reSize = () => {
    const { width }: { width: number } = window.screen;
    let ocupatedSpace: number = 0;
    let percentage: number = 0
    if (width < 401) {
      ocupatedSpace = cells * 5;
      percentage = 0.85;
    } else if (width < 551) {
      ocupatedSpace = cells * 8;
      percentage = 0.85;
    } else if (width < 751) {
      ocupatedSpace = cells * 10;
      percentage = 0.65;
    } else {
      ocupatedSpace = cells * 10;
      percentage = 0.35;
    }
    let newSize = ((width * percentage) - ocupatedSpace) / cells;
    changeSize(newSize);
  }

  // change the cells size based on the screen width
  useEffect(() => {
    window.addEventListener("resize", reSize);
  });

  // click function
  const hasClicked = (cell: CellInterface, e: React.MouseEvent): void => {
    let cellsArray: CellInterface[] | undefined = undefined;
    if (cell.firstClick) {
      cellsArray = getCells(cells, false);
      const cellsWithBombs: number[] = defineBombs(bombs, cellsArray, cell.position);
      cellsWithBombs.forEach((cell) => {
        countBombsArround(cell, cellsArray as CellInterface[]);
      });
      changeCellsState(cellsArray);
      isRunning(true);
    };
    const [newCells, trigger] = clickFunction(cell, cellsArray ? cellsArray : cellsState, cells, e);
    changeCellsState(newCells);
    let openCount = 0;
    newCells.forEach((cell) => (cell.isOpen && !cell.hasBomb) && openCount++);
    if (openCount === cells ** 2 - bombs) {
      openCount = 0;
      isRunning(false);
      win(true);
    } else if (trigger === "lose") {
      isRunning(false);
      lose(true);
    }
  };

  // set initials cells
  useEffect((): void => {
    const cellsArray: CellInterface[] = getCells(cells);
    changeCellsState(cellsArray);
    isRunning(false);
  }, [bombs, cells, isReseting, isRunning]);

  // define the number of rolls
  useEffect((): void => {
    const temp: number[] = []
    for (let i = 0; i < cells; i++) {
      temp.push(i);
    };
    numberlineState(temp);
  }, [cells]);

  return (
    <div>
      <main>
        <div className="board">
          {
            numberline.map((x): ReactNode => {
              return (
                <div
                  key={`${x}Line`}
                  className="line"
                >
                  {
                    cellsState.map((cell, i): ReactNode => {
                      return (
                        x === Number(cell.position.split('x')[0]) &&
                        <button
                          key={`${i}Cell`}
                          className={`cell ${cell.class}`}
                          onClick={(e) => hasClicked(cell, e)}
                          onContextMenu={(e) => hasClicked(cell, e)}
                          disabled={ triggers[0] || triggers[1] ? true : cell.isOpen }
                        >
                          <img
                            height={cellsSize}
                            width={cellsSize}
                            alt="none"
                            src={cell.img}
                          />
                          <p>
                            {
                              cell.hasFlag ? '🚩' : (!cell.hasBomb && cell.isOpen && cell.bombsArround > 0) ? cell.bombsArround : ''
                            }
                          </p>
                        </button>
                      )
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </main>
      <button onClick={ reSize } className="resize">
        Resize
      </button>
    </div>
  );
}

export default Board;

