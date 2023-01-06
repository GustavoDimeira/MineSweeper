import Minesweeper from './games/minesweeper.tsx';

function App() {
  return (
    <div className="App">
      <Minesweeper bombs={ 12 } cells={ 8 }/>
    </div>
  );
}

export default App;
