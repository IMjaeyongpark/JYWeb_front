import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const connectTest = () => {
  return axios.get(`${BASE_URL}/user/test`);
};


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

export const logout = async () => {
  const accessToken = localStorage.getItem('accessToken');

  return await axios.delete(`${BASE_URL}/user/logout`, {
    headers: {
      Authorization: accessToken,
    },
  });
};

