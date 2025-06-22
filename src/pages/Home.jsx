import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout as logoutApi } from '../api/user';
import BoardList from '../components/BoardList'; // ← 경로에 맞게 import

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const goToAPItest = () => { navigate('/APItest'); };
  const goToLoginPage = () => { navigate('/LoginPage'); };
  const goToSignupPage = () => { navigate('/SignupPage'); };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('로그아웃 오류:', err);
    }
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
        <>
          <button onClick={goToLoginPage}>로그인</button>
          <button onClick={goToSignupPage}>회원가입</button>
        </>
      )}
      {/* 게시글 리스트 */}
      <BoardList />
    </div>
  );
}
