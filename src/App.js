import './App.css';

import Minesweeper from './games/minesweeper.tsx';

function App() {
  return (
    <div className="App">
      <Minesweeper bombs={ 8 } cells={ 8 }/>
    </div>
  );
}

export default App;
