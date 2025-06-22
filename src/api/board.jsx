import axios from 'axios';
import axiosInstance from './axiosInstance';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//게시물 등록
export const createBoard = async (title, content) => {

    return await axiosInstance.post(`${BASE_URL}/board/create`, {
        'title': title,
        'content': content
    });
};

//게시글 삭제
export const deleteBoard = async (boardId) => {
    return await axiosInstance.delete(`${BASE_URL}/board/delete/${boardId}`);
};

//게시물 목록 가져오기
export const getBoard = async (pageNum, pageSize) => {
    const params = { pageNum };
    if (pageSize !== undefined && pageSize !== null) {
        params.pageSize = pageSize;
    }
    return await axios.get(`${BASE_URL}/board/get`, { params });
};

//게시글 상세 내용 가져오기
export const getBoardDetail = async (boardId) => {
    return await axios.get(`${BASE_URL}/board/getDetail`, {
        params: { boardId }
    });
};

//특정 사용자 게시물 목록 가져오기
export const getUserBoard = async (pageNum, pageSize) => {
    const params = { pageNum };
    if (pageSize !== undefined && pageSize !== null) {
        params.pageSize = pageSize;
    }
    return await axiosInstance.get(`${BASE_URL}/board/getUser`, { params });
};