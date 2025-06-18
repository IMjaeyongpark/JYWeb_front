import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout as logoutApi } from '../api/user'; // ← 경로에 맞게 조정

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const goToAPItest = () => {
    navigate('/APItest');
  };

  const goToLoginPage = () => {
    navigate('/LoginPage');
  };

  const handleLogout = async () => {
    try {
      await logoutApi(); // 서버에 로그아웃 요청
    } catch (err) {
      console.error('로그아웃 오류:', err);
    }

    // 클라이언트 토큰 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('loginId');
    localStorage.removeItem('nickname');
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  return (
    <div>
      <button onClick={goToAPItest}>소개 페이지로 이동</button>
      {isLoggedIn ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <button onClick={goToLoginPage}>로그인</button>
      )}
    </div>
  );
}
