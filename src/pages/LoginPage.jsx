import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/user';

export default function LoginPage() {
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
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

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
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="loginId"
          placeholder="아이디"
          value={form.loginId}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">로그인</button>
      </form>
      <button onClick={goToSignup}>회원가입</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
