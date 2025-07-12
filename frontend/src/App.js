import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login></Login>} />
      </Routes>
    </Router>
  );
}

export default App;
