/* eslint-disable no-loop-func */
import { CellInterface } from "./mineSweeper.interfaces";

import grass1 from './images/grass1.png';
import grass2 from './images/grass2.png';
import grass3 from './images/grass3.png';
import grass4 from './images/grass4.png';
import grass5 from './images/grass5.png';
import grass6 from './images/grass6.png';

import dirt1 from './images/dirt1.png';
import dirt2 from './images/dirt2.png';
import dirt3 from './images/dirt3.png';
import dirt4 from './images/dirt4.png';
import dirt5 from './images/dirt5.png';
import dirt6 from './images/dirt6.png';

const imgGrass: string[] = [grass1, grass2, grass3, grass4, grass5, grass6];
const imgDirt: string[] = [dirt1, dirt2, dirt3, dirt4, dirt5, dirt6];

export class MineSweeperClass {
  // define what will happen after a click
  clickFunction = (cell: CellInterface, i: number, cellsState: CellInterface[], cellsN: number): [CellInterface[], boolean] => {
    const arrayCells = [...cellsState];
    if (cell.bombsArround === 0 && cell.hasBomb === false) {
      this.getConnected(arrayCells, cellsN, i);
    } else {
      this.openCell(i, arrayCells);
    };
    return [arrayCells, cell.hasBomb];
  };

  // create the object cells
  getCells = (cells: number): CellInterface[] => {
    let finalArray: CellInterface[] = [];
    for (let i = 0; i < cells; i++) {
      for (let x = 0; x < cells; x++) {
        const img: number = Math.floor(Math.random() * 6)
        finalArray = [
          ...finalArray,
          {
            position: `${i}x${x}`,
            isOpen: false,
            class: 'closed',
            img: imgGrass[img],
            hasBomb: false,
            bombsArround: 0,
            connectadeWith: null,
            hasFlag: false,
          },
        ];
      };
    };
    return finalArray;
  };

  // set where the bombs are gonna be, it returns an array of values from 1 up to the last cell number (in order use it to find farray positions, is recomendade to remove 1 from each number)
  defineBombs = (
    bombs: number,
    cellsArray: CellInterface[]
  ): number[] => {
    let bombsPositons: number[] = [];
    while (bombsPositons.length < bombs) {
      const addBomb: number = Math.floor((Math.random() * (cellsArray.length)));
      (bombsPositons.find((positon) => positon === addBomb) === undefined) && bombsPositons.push(addBomb);
    }
    bombsPositons.forEach((positon) => {
      cellsArray.splice(positon, 1, {
        ...cellsArray[positon],
        hasBomb: true
      });
    });
    return bombsPositons;
  };

  countBombsArround = (cellIndex: number, cellsState: CellInterface[], cellsAmount: number): void => {
    const cells = this.getCellsArround(cellsState[cellIndex].position, cellsAmount);
    cells.forEach((cellI) => {
      cellI !== -1 && cellsState.splice(cellI, 1, {
        ...cellsState[cellI],
        bombsArround: cellsState[cellI].bombsArround + 1,
      });
    });
  };

  getConnected = (cellsState: CellInterface[], cellsN: number, i: number) => {
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
      this.openCell(index, cellsState);
    });
  };

  //utilits
  getCellsArround = (position: string, cellsN: number): number[] => {
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

  isEmptyCell = (cell: CellInterface): boolean => {
    return cell.connectadeWith === null && !cell.hasBomb && cell.bombsArround === 0
  };

  openCell = (i: number, arrayCells: CellInterface[]) => {
    const img: number = Math.floor(Math.random() * 6)
    arrayCells.splice(i, 1, {
      ...arrayCells[i],
      isOpen: true,
      class: `${!arrayCells[i].hasBomb ? 'open' : 'explod'}`,
      img: imgDirt[img],
    });
  };
};

/*
        while (emptyAdd.length > 0) {
          emptyAdd.forEach((newCell) => {
            emptyAdd = [];
            const newCells = this.getCellsArround(cellsState[newCell].position, cellsN);
            const filterdCells = newCells.filter((n) => n >= 0);
            const temp = [...filterdCells];
            emptyAdd = temp.filter((cellI) => this.isEmptyCell(cellsState[cellI]) && !newArray.includes(cellI));
            newArray = [...newArray, ...filterdCells].filter((x, i, a) => a.indexOf(x) === i);
          });
        }
        console.log(newArray);
*/