import React, { useState } from 'react';

import './css/mineSweeperConfig.css';

function Config({ restart, changeInfos, width }: { restart: Function, changeInfos: Function, width: string }) {
  const [selectedOption, changeSelectedOption] = useState("medium");

  const changeOption = (boarInfos: { size: number, bombs: number }, mode: string) => {
    restart();
    changeSelectedOption(mode);
    changeInfos(boarInfos);
  };

  return (
    <div className="config" style={{ "width": `${width}px` }}>
      <form>
        <div className="radio">
          <label>
            <input type="radio"
              onClick={() => changeOption({ size: 10, bombs: 4 }, "easy")}
              checked={selectedOption === "easy"}
            />
            Easy
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio"
              onClick={() => changeOption({ size: 15, bombs: 40 }, "medium")}
              checked={selectedOption === "medium"}
            />
            Medium
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio"
              onClick={() => changeOption({ size: 20, bombs: 80 }, "hard")}
              checked={selectedOption === "hard"}
            />
            Hard
          </label>
        </div>
      </form>
    </div>
  );
}

export default Config;
