import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../../api/user';
import { useState } from 'react';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [headerSearchKeyword, setHeaderSearchKeyword] = useState('');

  const goToLoginPage = () => navigate('/login');
  const goToSignupPage = () => navigate('/signup');
  const goHome = () => navigate('/');

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
    navigate('/');
  };

  // 헤더에서 검색 시 /board-list로 이동 + 쿼리 전달
  const handleHeaderSearch = (e) => {
    e.preventDefault();
    if (!headerSearchKeyword) return;
    navigate(`/board-list?page=0&keyword=${encodeURIComponent(headerSearchKeyword)}`);
    setHeaderSearchKeyword('');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.logo} onClick={goHome}>Home</span>
        <div className={styles.center}>
          <form onSubmit={handleHeaderSearch}>
            <input
              className={styles.search}
              placeholder="검색"
              value={headerSearchKeyword}
              onChange={e => setHeaderSearchKeyword(e.target.value)}
            />
            <button type="submit" style={{ display: 'none' }} />
          </form>
        </div>
        <div className={styles.right}>
          {isLoggedIn ? (
            <button className={styles.btn} onClick={handleLogout}>로그아웃</button>
          ) : (
            <>
              <button className={styles.btn} onClick={goToLoginPage}>로그인</button>
              <button className={styles.btn} onClick={goToSignupPage}>회원가입</button>
            </>
          )}
        </div>
      </div>
      <nav className={styles.nav}>
        <a href="/">테스트1</a>
        <a href="/">테스트2</a>
      </nav>
    </header>
  );
}
