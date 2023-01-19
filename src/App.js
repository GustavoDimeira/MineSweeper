import Minesweeper from './games/mineSweeper';

import "./app.css";

import {
  BrowserRouter,
  Route,
  Routes,
  Link,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>
          <h1 className="title">
            Minesweeper
          </h1>
          <Link to="/game">
            <button className="play">
              Play
            </button>
          </Link>
        </div>}>
        </Route>
        <Route path="/game" className="mineSweeper" element={<Minesweeper />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
