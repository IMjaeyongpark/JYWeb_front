import styles from './LoginPage.module.css';
import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/user';

export default function LoginPage({ setIsLoggedIn }) {
  const [form, setForm] = useState({ loginId: '', password: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const { accessToken, refreshToken, loginId, nickname } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('loginId', loginId);
      localStorage.setItem('nickname', nickname);

      setIsLoggedIn(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError('로그인 실패');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  if (localStorage.getItem('accessToken')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>로그인</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="loginId"
            placeholder="아이디"
            value={form.loginId}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>로그인</button>
        </form>
        <button onClick={goToSignup} className={styles.secondaryButton}>
          회원가입
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
