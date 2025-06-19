// src/components/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    // 로그인 안 되어 있으면 로그인 페이지로 이동하면서 현재 위치를 기억
    return <Navigate to="/LoginPage" state={{ from: location }} replace />;
  }

  return children;
}
