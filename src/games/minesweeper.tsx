import React, { ReactNode, useEffect, useState } from 'react';

import { MineSweeperClass } from './utilits/mineSweeper.funcs';
import { CellInterface } from './utilits/mineSweeper.interfaces';
import './mineSweeper.css';

const {
  getCells, defineBombs, clickFunction,
  countBombsArround
} = new MineSweeperClass();

function Minesweeper({ cells, bombs }: { cells: number, bombs: number }) {
  const [cellsSize, changeSize] = useState<number>(25);

  const [cellsState, changeCellsState] = useState<CellInterface[]>([]);
  const [numberline, numberlineState] = useState<number[]>([]);

  const [loseTrigger, changeLose] = useState<boolean>(false);
  const [isReseting, reset] = useState<boolean>(true);

  console.log(loseTrigger)

  useEffect(() => {
    console.log(cellsSize);
  }, [cellsSize])

  // change the cells size based on the screen smaller size
  useEffect(() => {
    window.addEventListener("resize", () => {
      const { width }: { width: number} = window.screen;
      let ocupatedSpace: number = 0;
      let percentage: number = 0;
      if (width < 401) {
        ocupatedSpace = cells * 5 + 6;
        percentage = 0.90
      } else if (width < 551 ) {
        ocupatedSpace = cells * 8 + 8;
        percentage = 0.85;
      } else {
        ocupatedSpace = cells * 10 + 12;
        percentage = 0.75;
      }
      const newSize = Math.floor(((width - ocupatedSpace) * percentage) / cells);
      changeSize(newSize);
    });
  }, [cells, bombs]);
  
  // click function
  const hasClicked = (cell: CellInterface, e: React.MouseEvent): void => {
    let cellsArray: CellInterface[] | undefined= undefined;
    if (cell.firstClick) {
      cellsArray = getCells(cells, false);
      const cellsWithBombs: number[] = defineBombs(bombs, cellsArray, cell.position);
      cellsWithBombs.forEach((cell) => {
        countBombsArround(cell, cellsArray as CellInterface[]);
      });
      changeCellsState(cellsArray);
    };
    const [newCells, trigger] = clickFunction(cell, cellsArray ? cellsArray : cellsState, cells, e);
    changeCellsState(newCells);
    trigger && changeLose(trigger);
  };

  // set initials cells
  useEffect((): void => {
    const cellsArray: CellInterface[] = getCells(cells);
    changeCellsState(cellsArray);
  }, [bombs, cells, isReseting]);

  // define the number of rolls
  useEffect((): void => {
    const temp: number[] = []
    for (let i = 0; i < cells; i++) {
      temp.push(i);
    };
    numberlineState(temp);
  }, [cells]);

  return (
    <main>
      <div className="board">
        <button
          onClick={() => reset(!isReseting)}
        >
          Reset
        </button>
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
                        disabled={cell.isOpen}
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
  );
}

export default Minesweeper;

