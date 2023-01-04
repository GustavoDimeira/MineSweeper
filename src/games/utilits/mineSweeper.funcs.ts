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

const imgGrass = [grass1, grass2, grass3, grass4, grass5, grass6];
const imgDirt = [dirt1, dirt2, dirt3, dirt4, dirt5, dirt6];

export class MineSweeperClass {
  // create the object cells
  getCells = (cells: number): CellInterface[] => {
    let finalArray: CellInterface[] = [];
    for (let i = 0; i < cells; i++) {
      for (let x = 0; x < cells; x++) {
        const img: number = Math.floor(Math.random() * 6)
        finalArray = [
          ...finalArray,
          {
            positon: `${i}x${x}`,
            hasBomb: false,
            connectadeWith: null,
            isOpen: false,
            class: 'closed',
            img: imgGrass[img],
          },
        ];
      };
    };
    return finalArray;
  };

  // set where the bombs are gonna be
  defineBombs = (
    bombs: number,
    cellsArray: CellInterface[]
    ): void => {
      let bombsPositons: number[] = [];
      while (bombsPositons.length < bombs) {
        const addBomb: number = Math.ceil((Math.random() * (cellsArray.length)));
        !bombsPositons.find((positon) => positon === addBomb) && bombsPositons.push(addBomb);
      }
      bombsPositons.forEach((positon) => {
        cellsArray.splice(positon - 1, 1, {
          ...cellsArray[positon - 1],
          hasBomb: true
        });
      });
  };

  // define what will happen after a click
  clickFunction = (cell: CellInterface, i: number, cellsState: CellInterface[]): CellInterface[] => {
    const img: number = Math.floor(Math.random() * 6)
    const arrayCells = [...cellsState];
    arrayCells.splice(i, 1, {
      ...cellsState[i],
      isOpen: true,
      class: `${!cell.hasBomb ? 'open' : 'explod'}`,
      img: imgDirt[img],
    })
    return arrayCells;
  };

  countBombs = (cell: CellInterface, cellsState: CellInterface[], cellsAmount: number) => {
    const cells = this.getCellsArround(cell.positon, cellsAmount);
    cells.forEach((cellBomb) => {
      console.log(cellBomb);
    });
  };

  //utilits
  getCellsArround = (position: string, cellsN: number): (number | boolean)[] => {
    const pos1 = Number(position.split('x')[0]);
    const pos2 = Number(position.split('x')[1]);

    let key1 = (pos1 !== 0 && pos2 !== 0) && (pos1 - 1) * cellsN + pos2 - 1;
    let key2 = (pos1 !== 0) && (pos1 - 1) * cellsN + pos2;
    let key3 = (pos1 !== 0 && pos2 !== cellsN - 1) && (pos1 - 1) * cellsN + pos2 + 1;
    let key4 = (pos2 !== 0) && (pos1) * cellsN + pos2 - 1;
    let key6 = (pos2 !== cellsN - 1) && (pos1) * cellsN + pos2 + 1;
    let key7 = (pos1 !== cellsN - 1 && pos2 !== 0) && (pos1 + 1) * cellsN + pos2 - 1;
    let key8 = (pos1 !== cellsN - 1) && (pos1 + 1) * cellsN + pos2;
    let key9 = (pos1 !== cellsN - 1 && pos2 !== cellsN - 1) && (pos1 + 1) * cellsN + pos2 + 1;

    return [key1, key2, key3, key4, key6, key7, key8, key9];
  };
};
