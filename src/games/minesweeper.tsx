import React, { ReactNode, useEffect, useState } from 'react';

import { MineSweeperClass } from './utilits/mineSweeper.funcs';
import { CellInterface } from './utilits/mineSweeper.interfaces';
import './mineSweeper.css';

const { getCells, defineBombs, clickFunction, countBombs } = new MineSweeperClass();

function Minesweeper({ cells, bombs }: { cells: number, bombs: number }) {
  const [cellsState, changeCellsState] = useState<CellInterface[]>([]);
  const [numberline, numberlineState] = useState<number[]>([]);

  const hasClicked = (cell: CellInterface, i: number): void => {
    const newCells = clickFunction(cell, i, cellsState);
    changeCellsState(newCells);
  };

  useEffect((): void => {
    const cellsArray: CellInterface[] = getCells(cells);
    defineBombs(bombs, cellsArray);
    changeCellsState(cellsArray);
    countBombs(cellsArray[7], cellsArray, cells);
  }, [bombs, cells]);

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
                    x === Number(cell.positon.split('x')[0]) &&
                    <img
                      alt="none"
                      src={ cell.img }
                      width="50"
                      height="50"
                      key={`${i}Cell`}
                      className={`cell ${cell.class}`}
                      onClick={() => hasClicked(cell, i)}
                    />
                  )
                })
              }
            </div>
          );
        })
      }
    </main>
  );
}

export default Minesweeper;
