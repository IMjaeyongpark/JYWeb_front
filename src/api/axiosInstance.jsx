// src/api/axiosInstance.js

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

// 응답 인터셉터로 accessToken 만료 자동 감지 및 refresh
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
                        originalRequest.headers.Authorization = token;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            try {
                const res = await refresh();
                const newAccessToken = res.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // 대기 중이던 요청 처리
                onRefreshed(newAccessToken);

                originalRequest.headers.Authorization = newAccessToken;
                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // 강제로그인 이동
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
