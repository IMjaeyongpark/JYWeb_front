import axios from 'axios';
import axiosInstance from './axiosInstance';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


//연결 테스트
export const connectTest = () => {
  return axios.get(`${BASE_URL}/user/test`);
};

//로그인
export const login = async ({ loginId, password }) => {
  return await axios.post(`${BASE_URL}/user/login`, {
    'loginId' : loginId,
    'password' : password,
  }, {
    headers: {
      'Content-Type': 'application/json'  // 명시적으로 추가해주면 안정적
    }
  });
};

//회원가입
export const register = async ({ loginId, password, nickname }) => {
  return await axios.post(`${BASE_URL}/user/register`, {
    'loginId' : loginId,
    'password' : password,
    'nickname' : nickname
  }, {
    headers: {
      'Content-Type': 'application/json'  // 명시적으로 추가해주면 안정적
    }
  });
};

//로그아웃
export const logout = async () => {
  const accessToken = localStorage.getItem('accessToken');

  return await axiosInstance.delete(`${BASE_URL}/user/logout`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

//엑세스 토큰 재발급
export const refresh = async () => {


  const loginId = localStorage.getItem('loginId');
  const refreshToken = localStorage.getItem('refreshToken');

  return await axios.post(`${BASE_URL}/user/refresh`, {
    'loginId' : loginId,
    'refreshToken' : refreshToken,
  }, {
    headers: {
      'Content-Type': 'application/json'  // 명시적으로 추가해주면 안정적
    }
  });
};

//아이디 중복 확인
export const checkId = async (loginId) => {

  return await axios.get(`${BASE_URL}/user/checkId`,
    {
      params: { loginId },
    })
};

//닉네임 중복 확인
export const checkNickname = async (nickname) => {

  return await axios.get(`${BASE_URL}/user/checkNickname`,
  {
    params: { nickname },
  })
};

