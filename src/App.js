import Minesweeper from './games/minesweeper.tsx';

function App() {
  return (
    <div className="App">
      <Minesweeper bombs={ 64 } cells={ 24 }/>
    </div>
  );
}

export default App;
