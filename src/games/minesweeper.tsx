import React, { ReactNode, useEffect, useState } from 'react';

import { MineSweeperClass } from './utilits/mineSweeper.funcs';
import { CellInterface } from './utilits/mineSweeper.interfaces';
import './mineSweeper.css';

const {
  getCells, defineBombs, clickFunction,
  countBombsArround
} = new MineSweeperClass();

function Minesweeper({ cells, bombs }: { cells: number, bombs: number }) {
  const [cellsState, changeCellsState] = useState<CellInterface[]>([]);
  const [numberline, numberlineState] = useState<number[]>([]);

  // const [firstClick, changeFirstClick] = useState<boolean>(true);
  const [loseTrigger, changeLose] = useState<boolean>(false);
  const [isReseting, reset] = useState<boolean>(true);

  console.log(loseTrigger);

  const hasClicked = (cell: CellInterface, i: number): void => {
    const [newCells, trigger] = clickFunction(cell, i, cellsState, cells);
    changeCellsState(newCells);
    changeLose(trigger);
  };

  useEffect((): void => {
    if (isReseting) {
      reset(false);
      const cellsArray: CellInterface[] = getCells(cells);
      const cellsWithBombs: number[] = defineBombs(bombs, cellsArray);
      cellsWithBombs.forEach((cell) => {
        countBombsArround(cell, cellsArray, cells);
      });
      changeCellsState(cellsArray);
    };
  }, [bombs, cells, isReseting]);

  useEffect((): void => {
    const temp: number[] = []
    for (let i = 0; i < cells; i++) {
      temp.push(i);
    };
    numberlineState(temp);
  }, [cells]);

  return (
    <main className="board">
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
                      onClick={() => hasClicked(cell, i)}
                      disabled={cell.isOpen}
                    >
                      {cell.hasBomb ? 'bomb' : !cell.bombsArround ? '.' : cell.bombsArround}
                    </button>

                  )
                })
              }
            </div>
          );
        })
      }
      <button
        onClick={() => reset(true)}
      >
        Reset
      </button>
    </main>
  );
}

export default Minesweeper;

