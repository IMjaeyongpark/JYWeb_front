import React, { useEffect, useState } from 'react';
import { checkId, checkNickname, register } from '../api/user';
import { useNavigate } from 'react-router-dom';

export default function Signup() {


  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    loginId: '',
    password: '',
    checkpw: '',
    nickname: ''
  });
  const [idMessage, setIdMessage] = useState('');
  const [isIdDuplicate, setIsIdDuplicate] = useState(null);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(null);
  const [pwMessage, setPwMessage] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  useEffect(() => {
    document.title = '회원가입';
  }, []);

  // input 값 변경시 메시지 초기화 및 실시간 비밀번호 확인 체크
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'loginId') {
      setIdMessage('');
      setIsIdDuplicate(null);
    }
    if (name === 'nickname') {
      setNicknameMessage('');
      setIsNicknameDuplicate(null);
    }
    if (name === 'checkpw' || name === 'password') {
      // 비밀번호 일치 체크
      const pw = name === 'password' ? value : form.password;
      const checkpw = name === 'checkpw' ? value : form.checkpw;
      if (pw && checkpw) {
        setPwMessage(
          pw === checkpw ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.'
        );
      } else {
        setPwMessage('');
      }
    }
  };

  // 아이디 중복 체크
  const signupCheckId = async () => {
    try {
      const res = await checkId(form.loginId); // true면 중복
      setIsIdDuplicate(res.data);
      if (res.data) setIdMessage('아이디 중복');
      else setIdMessage('사용 가능한 아이디');
    } catch (err) {
      setIdMessage('오류');
    }
  };

  // 닉네임 중복 체크
  const signupCheckNickname = async () => {
    try {
      const res = await checkNickname(form.nickname); // true면 중복
      setIsNicknameDuplicate(res.data);
      if (res.data) setNicknameMessage('닉네임 중복');
      else setNicknameMessage('사용 가능한 닉네임');
    } catch (err) {
      setNicknameMessage('오류');
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    // 예외 처리
    if (isIdDuplicate || isNicknameDuplicate) {
      setSignupError('아이디/닉네임 중복을 확인해주세요.');
      return;
    }
    if (form.password !== form.checkpw) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 필수값 체크
    if (!form.loginId || !form.password || !form.nickname) {
      setSignupError('모든 항목을 입력해주세요.');
      return;
    }
    try {
      await register(form); // 실제 회원가입 api 함수
      setSignupSuccess('회원가입 성공! 로그인 해주세요.');
      setForm({ loginId: '', password: '', checkpw: '', nickname: '' });
      goToLoginPage()
    } catch (err) {
      setSignupError('회원가입 실패');
    }
  };

  const goToLoginPage = () => {
    navigate('/LoginPage');
  };

  // 회원가입 버튼 비활성화 조건
  const isDisabled =
    !form.loginId ||
    !form.password ||
    !form.checkpw ||
    !form.nickname ||
    isIdDuplicate ||
    isNicknameDuplicate ||
    form.password !== form.checkpw;

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="loginId"
            placeholder="아이디"
            value={form.loginId}
            onChange={handleChange}
          />
          <button type="button" onClick={signupCheckId}>아이디 중복 확인</button>
        </div>
        {idMessage && (
          <p style={{ color: isIdDuplicate ? 'red' : 'green' }}>{idMessage}</p>
        )}
        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="checkpw"
            placeholder="비밀번호 확인"
            value={form.checkpw}
            onChange={handleChange}
          />
        </div>
        {pwMessage && (
          <p style={{ color: form.password === form.checkpw ? 'green' : 'red' }}>{pwMessage}</p>
        )}
        <div>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
          />
          <button type="button" onClick={signupCheckNickname}>닉네임 중복 확인</button>
        </div>
        {nicknameMessage && (
          <p style={{ color: isNicknameDuplicate ? 'red' : 'green' }}>{nicknameMessage}</p>
        )}
        <button type="submit" disabled={isDisabled}>회원가입</button>
        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
        {signupSuccess && <p style={{ color: 'green' }}>{signupSuccess}</p>}
      </form>
    </div>
  );
}
