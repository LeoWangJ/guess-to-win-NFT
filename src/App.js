import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllNFT from './pages/allNFT'
import MyGuessList from './pages/myGuessList'
import MyNFT from './pages/myNFT'
import GuessToWin from './pages'
import Menu from './components/menu'
function App() {
  return (
    <div className="App">
      <Router>
        <Menu></Menu>
        <Routes>
          <Route path="/allNFT" element={<AllNFT />} />
          <Route path="/myGuessList" element={<MyGuessList />} />
          <Route path="/myNFT" element={<MyNFT />} />
          <Route path="/" element={<GuessToWin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
