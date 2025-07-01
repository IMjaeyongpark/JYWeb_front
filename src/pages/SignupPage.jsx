import React, { useEffect, useState } from 'react';
import styles from './SignupPage.module.css';
import { checkId, checkNickname, register } from '../api/user';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: '',
    password: '',
    checkpw: '',
    nickname: ''
  });

  const [idMessage, setIdMessage] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const [pwConditionMessage, setPwConditionMessage] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [isIdValid, setIsIdValid] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isPwValid, setIsPwValid] = useState(false);
  const [isIdDuplicate, setIsIdDuplicate] = useState(null);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(null);

  useEffect(() => {
    document.title = '회원가입';
  }, []);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,20}$/;
  const idRegex = /^[A-Za-z][A-Za-z0-9]{4,14}$/;
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'loginId') {
      const valid = idRegex.test(value);
      setIsIdValid(valid);
      setIdMessage(valid ? '' : '아이디는 5~15자, 첫 글자 영문, 영문/숫자만 가능합니다.');
      setIsIdDuplicate(null);
    }
    if (name === 'nickname') {
      const valid = nicknameRegex.test(value);
      setIsNicknameValid(valid);
      setNicknameMessage(valid ? '' : '닉네임은 2~10자, 한글, 영문, 숫자만 가능합니다.');
      setIsNicknameDuplicate(null);
    }
    if (name === 'password') {
      const valid = passwordRegex.test(value);
      setIsPwValid(valid);
      setPwConditionMessage(valid ? '사용 가능한 비밀번호입니다.' : '비밀번호는 8~20자, 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
      if (form.checkpw) {
        setPwMessage(value === form.checkpw ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.');
      } else setPwMessage('');
    }
    if (name === 'checkpw') {
      setPwMessage(value === form.password ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.');
    }
  };

  const signupCheckId = async () => {
    try {
      if (isIdValid) {
        const res = await checkId(form.loginId);
        setIsIdDuplicate(res.data);
        setIdMessage(res.data ? '아이디 중복' : '사용 가능한 아이디');
      }
    } catch {
      setIdMessage('오류');
    }
  };

  const signupCheckNickname = async () => {
    try {
      if (isNicknameValid) {
        const res = await checkNickname(form.nickname);
        setIsNicknameDuplicate(res.data);
        setNicknameMessage(res.data ? '닉네임 중복' : '사용 가능한 닉네임');
      }
    } catch {
      setNicknameMessage('오류');
    }
  };

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
    try {
      await register(form);
      setSignupSuccess('회원가입 성공! 로그인 해주세요.');
      setForm({ loginId: '', password: '', checkpw: '', nickname: '' });
      navigate('/login');
    } catch {
      setSignupError('회원가입 실패');
    }
  };

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
    <div className={styles.signupContainer}>
      <h1 className={styles.signupTitle}>회원가입</h1>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="loginId"
            placeholder="아이디"
            className={styles.input}
            value={form.loginId}
            onChange={handleChange}
          />
          <button type="button" className={styles.checkButton} onClick={signupCheckId}>중복확인</button>
        </div>
        {idMessage && <p className={`${styles.message} ${isIdDuplicate ? styles.error : styles.success}`}>{idMessage}</p>}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className={styles.input}
          value={form.password}
          onChange={handleChange}
        />
        {pwConditionMessage && <p className={`${styles.message} ${isPwValid ? styles.success : styles.error}`}>{pwConditionMessage}</p>}

        <input
          type="password"
          name="checkpw"
          placeholder="비밀번호 확인"
          className={styles.input}
          value={form.checkpw}
          onChange={handleChange}
        />
        {pwMessage && <p className={`${styles.message} ${form.password === form.checkpw ? styles.success : styles.error}`}>{pwMessage}</p>}

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            className={styles.input}
            value={form.nickname}
            onChange={handleChange}
          />
          <button type="button" className={styles.checkButton} onClick={signupCheckNickname}>중복확인</button>
        </div>
        {nicknameMessage && <p className={`${styles.message} ${isNicknameDuplicate ? styles.error : styles.success}`}>{nicknameMessage}</p>}

        <button type="submit" className={styles.submitButton} disabled={isDisabled}>회원가입</button>
        {signupError && <p className={`${styles.message} ${styles.error}`}>{signupError}</p>}
        {signupSuccess && <p className={`${styles.message} ${styles.success}`}>{signupSuccess}</p>}
      </form>
    </div>
  );
}
