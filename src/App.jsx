import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import APItest from './pages/APItest';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/APItest" element={<APItest />} />
        <Route path="/LoginPage" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}