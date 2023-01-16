/* eslint-disable no-loop-func */
import { CellInterface } from "./mineSweeper.interfaces";

import explosion2 from './images/explosion2.png';

export class MineSweeperClass {
  // define what will happen after a click
  public clickFunction = (cell: CellInterface, cellsState: CellInterface[], cellsN: number, e: React.MouseEvent): [CellInterface[], string | false] => {
    const arrayCells = [...cellsState];
    const i: number = Number(cell.position.split('x')[0])*cellsN + Number(cell.position.split('x')[1]);
    if (e.type === 'click') {
      if (!cell.hasFlag) {
        if (cell.bombsArround === 0 && cell.hasBomb === false) {
          this.openConnectds(arrayCells, cellsN, i);
        } else {
          this.openCell(i, arrayCells, false);
        };
        return [arrayCells, cell.hasBomb && "lose"];
      }
    } else {
      arrayCells.splice(i, 1, {
        ...arrayCells[i],
        hasFlag: cell.isOpen ? false : !arrayCells[i].hasFlag,
      });
    };

    return [arrayCells, false];
  };

  // create the object cells
  public getCells = (cells: number, isFirstClick: boolean = true): CellInterface[] => {
    let finalArray: CellInterface[] = [];
    for (let i = 0; i < cells; i++) {
      for (let x = 0; x < cells; x++) {
        finalArray = [
          ...finalArray,
          {
            position: `${i}x${x}`,
            isOpen: false,
            class: 'closed',
            img: explosion2,
            hasBomb: false,
            bombsArround: 0,
            connectadeWith: null,
            hasFlag: false,
            firstClick: isFirstClick,
          },
        ];
      };
    };
    return finalArray;
  };

  // set where the bombs are gonna be, it returns an array of values from 1 up to the last cell number
  public defineBombs = (
    bombs: number,
    cellsArray: CellInterface[],
    firstClick: string,
  ): number[] => {
    const cellsN = Math.sqrt(cellsArray.length);
    let invalidPos: number[] = [
      ...this.getCellsArround(firstClick, cellsN),
      Number(firstClick.split('x')[0]) * cellsN + Number(firstClick.split('x')[1]),
    ];
    let bombsPositons: number[] = [];
    while (bombsPositons.length < bombs) {
      const newBomb: number = Math.floor((Math.random() * (cellsArray.length)));
      let isNotIncluded = (bombsPositons.find((p) => p === newBomb) === undefined);
      let isInvalid = (invalidPos.find((p) => p === newBomb) === undefined);
      (isNotIncluded && isInvalid) && bombsPositons.push(newBomb);
    }
    bombsPositons.forEach((positon) => {
      cellsArray.splice(positon, 1, {
        ...cellsArray[positon],
        hasBomb: true
      });
    });
    return bombsPositons;
  };

  public countBombsArround = (cellIndex: number, cellsState: CellInterface[]): void => {
    const cellsN: number = Math.sqrt(cellsState.length);
    const cells: number[] = this.getCellsArround(cellsState[cellIndex].position, cellsN);
    cells.forEach((cellI) => {
      cellI !== -1 && cellsState.splice(cellI, 1, {
        ...cellsState[cellI],
        bombsArround: cellsState[cellI].bombsArround + 1,
      });
    });
  };

  public getCellsArround = (position: string, cellsN: number): number[] => {
    const pos1 = Number(position.split('x')[0]);
    const pos2 = Number(position.split('x')[1]);

    let key1 = (pos1 !== 0 && pos2 !== 0) ? (pos1 - 1) * cellsN + pos2 - 1 : -1;
    let key2 = (pos1 !== 0) ? (pos1 - 1) * cellsN + pos2 : -1;
    let key3 = (pos1 !== 0 && pos2 !== cellsN - 1) ? (pos1 - 1) * cellsN + pos2 + 1 : -1;
    let key4 = (pos2 !== 0) ? (pos1) * cellsN + pos2 - 1 : -1;
    let key6 = (pos2 !== cellsN - 1) ? (pos1) * cellsN + pos2 + 1 : -1;
    let key7 = (pos1 !== cellsN - 1 && pos2 !== 0) ? (pos1 + 1) * cellsN + pos2 - 1 : -1;
    let key8 = (pos1 !== cellsN - 1) ? (pos1 + 1) * cellsN + pos2 : -1;
    let key9 = (pos1 !== cellsN - 1 && pos2 !== cellsN - 1) ? (pos1 + 1) * cellsN + pos2 + 1 : -1;

    return [key1, key2, key3, key4, key6, key7, key8, key9];
  };

  //utilits

  private openConnectds = (cellsState: CellInterface[], cellsN: number, i: number): void => {
    const allEmptyCells: number[] = []
    cellsState.forEach((cell, i) => {
      this.isEmptyCell(cell) && allEmptyCells.push(i);
    });
    let emptyCells: number[] = [i]
    let newArray: number[] = [i];
    let prevArray: number[] = [];
    while (prevArray.length !== newArray.length) {
      prevArray = [...newArray];
      newArray.forEach((x) => {
        if (cellsState[x].bombsArround === 0) {
          const newCells = this.getCellsArround(cellsState[x].position, cellsN).filter((number) => number >= 0);
          newArray = [...newArray, ...newCells].filter((x, i, a) => a.indexOf(x) === i);
          const newEmpty = newCells.filter((number) => allEmptyCells.includes(number));
          emptyCells = [...emptyCells, ...newEmpty];
        }
      });
    };
    newArray.forEach((index) => {
      this.openCell(index, cellsState, true);
    });
  };

  private isEmptyCell = (cell: CellInterface): boolean => {
    return cell.connectadeWith === null && !cell.hasBomb && cell.bombsArround === 0
  };

  private openCell = (i: number, arrayCells: CellInterface[], openFlags: boolean): void => {
    const cell: CellInterface = arrayCells[i];
    if (!cell.isOpen && ((!cell.hasFlag) || openFlags)) {
      arrayCells.splice(i, 1, { 
        ...cell,
        isOpen: true,
        hasFlag: false,
        class: `${!cell.hasBomb ? ((cell.bombsArround) ? 'open' : 'open-empty') : 'explod'}`,
      });
    }
  };
};
