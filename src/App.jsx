import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import APItest from './pages/APItest';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import SignupPage from './pages/SignupPage';
import BoardDetailPage from './pages/BoardDetailPage';
import Header from './components/Header';
import BoardCreatePage from './pages/BoardCreatePage';



export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: '100px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/board/:boardId" element={<BoardDetailPage />} />
          <Route path="/APItest"
            element={
              <PrivateRoute>
                <APItest />
              </PrivateRoute>
            }
          />
           <Route path="/board/create"
            element={
              <PrivateRoute>
                <BoardCreatePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
