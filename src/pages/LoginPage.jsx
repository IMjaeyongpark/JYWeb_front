import { useState } from 'react';
import { login } from '../api/user';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          navigate('/');
        }
      }, [navigate]);

    const [form, setForm] = useState({
        loginId: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await login(form); // 객체 그대로 전달
            const { accessToken, refreshToken, loginId, nickname } = res.data;

            // 토큰 및 사용자 정보 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('loginId', loginId);
            localStorage.setItem('nickname', nickname);

            // 홈 페이지로 이동
            window.location.href = '/';
        } catch (err) {
            console.log(err.response)
            setError('로그인 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

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
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
