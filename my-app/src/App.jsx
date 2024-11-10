// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import NavBar from './components/ui/navBar.jsx';

export default function App() {
    return (
        <Router>
            <NavBar /> {/* Common NavBar for all pages */}
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}
