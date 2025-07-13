import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/route/PrivateRoute';
import SignupPage from './pages/SignupPage';
import BoardDetailPage from './pages/BoardDetailPage';
import Header from './components/layout/Header';
import BoardCreatePage from './pages/BoardCreatePage';
import BoardUpdatePage from './pages/BoardUpdatePage';
import BoardListPage from './pages/BoardListPage';



export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <BrowserRouter>
       <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div style={{ paddingTop: '100px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/board/:boardId" element={<BoardDetailPage />} />
          <Route path="/board-list" element={<BoardListPage />} />
           <Route path="/board/create"
            element={
              <PrivateRoute>
                <BoardCreatePage />
              </PrivateRoute>
            }
          />
          <Route path="/board/update/:boardId"
            element={
              <PrivateRoute>
                <BoardUpdatePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
