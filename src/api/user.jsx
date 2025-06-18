import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const connectTest = () => {
  return axios.get(`${BASE_URL}/user/test`);
};


