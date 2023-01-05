export interface CellInterface {
  position: string,
  hasBomb: boolean,
  connectadeWith: number | null,
  isOpen: boolean,
  class: string,
  img: string,
  bombsArround: number,
  hasFlag: boolean,
};