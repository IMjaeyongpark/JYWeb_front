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
  const [isIdValid, setIsIdValid] = useState(false);
  const [isIdDuplicate, setIsIdDuplicate] = useState(null);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(null);
  const [pwMessage, setPwMessage] = useState('');
  const [pwConditionMessage, setPwConditionMessage] = useState('');
  const [isPwValid, setIsPwValid] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  useEffect(() => {
    document.title = '회원가입';
  }, []);

  // 비밀번호 정규식: 영문+숫자+특수문자, 8~20자
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,20}$/;
  // 아이디 정규식: 5~15자, 영문/숫자(첫글자 영문)
  const idRegex = /^[A-Za-z][A-Za-z0-9]{4,14}$/;
  //닉네임 정규식: 2~10자, 한글, 영어, 숫자
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;



  // input 값 변경시 메시지 초기화 및 실시간 비밀번호 확인 체크
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'loginId') {
      if (!idRegex.test(value)) {
        setIdMessage('아이디는 5~15자, 첫 글자 영문, 영문/숫자만 가능합니다.');
        setIsIdValid(false);
      } else {
        setIdMessage('')
        setIsIdValid(true)
      }
      setIsIdDuplicate(null);
    }
    if (name === 'nickname') {
      if (!nicknameRegex.test(value)) {
        setNicknameMessage('닉네임은 2~10자, 한글, 영문, 숫자만 가능합니다.');
        setIsNicknameValid(false)
      } else {
        setNicknameMessage('');
        setIsNicknameValid(true)
      }
      setIsNicknameDuplicate(null);
    }
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        setPwConditionMessage('비밀번호는 8~20자, 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
        setIsPwValid(false);
      } else {
        setPwConditionMessage('사용 가능한 비밀번호입니다.');
        setIsPwValid(true);
      }
      // 비밀번호 확인 일치 여부 갱신
      if (form.checkpw) {
        setPwMessage(
          value === form.checkpw ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.'
        );
      } else {
        setPwMessage('');
      }
    }
    if (name === 'checkpw') {
      // 비밀번호 확인 변경시
      setPwMessage(
        value && form.password
          ? (value === form.password ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.')
          : ''
      );
    }
  };

  // 아이디 중복 체크
  const signupCheckId = async () => {
    try {
      if (isIdValid) {
        const res = await checkId(form.loginId); // true면 중복
        setIsIdDuplicate(res.data);
        if (res.data) setIdMessage('아이디 중복');
        else setIdMessage('사용 가능한 아이디');
      }
    } catch (err) {
      setIdMessage('오류');
    }
  };

  // 닉네임 중복 체크
  const signupCheckNickname = async () => {
    try {
      if (isNicknameValid) {
        const res = await checkNickname(form.nickname); // true면 중복
        setIsNicknameDuplicate(res.data);
        if (res.data) setNicknameMessage('닉네임 중복');
        else setNicknameMessage('사용 가능한 닉네임');
      }
    } catch (err) {
      setNicknameMessage('오류');
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    if (isIdDuplicate || isNicknameDuplicate) {
      setSignupError('아이디/닉네임 중복을 확인해주세요.');
      return;
    }
    if (form.password !== form.checkpw) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isPwValid) {
      setSignupError('비밀번호 조건을 확인해주세요.');
      return;
    }
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
    navigate('/login');
  };

  // 회원가입 버튼 비활성화 조건
  const isDisabled =
    !form.loginId ||
    !form.password ||
    !form.checkpw ||
    !form.nickname ||
    isIdDuplicate ||
    isNicknameDuplicate ||
    form.password !== form.checkpw ||
    !isPwValid;

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
        {pwConditionMessage && (
          <p style={{ color: isPwValid ? 'green' : 'red' }}>{pwConditionMessage}</p>
        )}
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
