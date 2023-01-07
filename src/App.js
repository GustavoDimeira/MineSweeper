import Minesweeper from './games/minesweeper.tsx';

function App() {
  return (
    <div className="App">
      <Minesweeper bombs={ 48 } cells={ 16 }/>
    </div>
  );
}

export default App;
