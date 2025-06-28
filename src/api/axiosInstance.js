import axios from 'axios';
import { refresh } from './user';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// 요청시 accessToken 붙이기
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = 'Bearer ' + accessToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
    subscribers.forEach((cb) => cb(token));
    subscribers = [];
}

function addSubscriber(cb) {
    subscribers.push(cb);
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // 이미 리프레시 중이면 큐에 넣고 기다림
                return new Promise((resolve) => {
                    addSubscriber((token) => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            try {
                const res = await refresh();
                const newAccessToken = res.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // 대기 중이던 요청 모두 재시도
                onRefreshed(newAccessToken);

                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
