import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import APItest from './pages/APItest';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignupPage" element={<SignupPage/>}/>

        {/* 로그인 필요한 경로 */}
        <Route
          path="/APItest"
          element={
            <PrivateRoute>
              <APItest />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
