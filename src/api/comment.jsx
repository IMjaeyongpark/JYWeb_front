import axios from 'axios';
import axiosInstance from './axiosInstance';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//댓글 등록
export const createComment = async (boardId, content, parentId) => {

    const body = { boardId, content };
    if (parentId !== undefined && parentId !== null) {
        body.parentId = parentId;
    }
    return await axiosInstance.post(`${BASE_URL}/comment/create`, { body });
};

//댓글 삭제
export const deleteComment = async (commentId) => {
    return await axiosInstance.delete(`${BASE_URL}/comment/delete/${commentId}`);
};

//댓글 가져오기
export const getComment = async (boardId) => {
    return await axios.get(`${BASE_URL}/comment/get`, { params: { boardId } });
};