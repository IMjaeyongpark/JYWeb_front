import axios from 'axios';
import axiosInstance from './axiosInstance';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//게시물 등록
export const createBoard = async (title, content, files = []) => {
    const formData = new FormData();
    // board라는 key에 JSON 통째로 (Blob)
    const boardData = { title, content };
    formData.append(
        'board',
        new Blob([JSON.stringify(boardData)], { type: 'application/json' })
    );

    files.forEach(file => {
        formData.append('files', file);
    });

    return await axiosInstance.post(
        `${BASE_URL}/board/create`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};



//게시글 삭제
export const deleteBoard = async (boardId) => {
    return await axiosInstance.delete(
        `${BASE_URL}/board/delete/${boardId}`
    );
};

// 게시물 목록 가져오기
export const getBoard = async (pageNum, pageSize, sort = 'createdAt', direction = 'desc') => {
    const params = { pageNum, sort, direction };
  
    if (pageSize !== undefined && pageSize !== null) {
      params.pageSize = pageSize;
    }
  
    return await axios.get(`${BASE_URL}/board/get`, { params });
  };


// 게시글 키워드 검색
export const searchBoards = async (keyword, pageNum, pageSize, sort = 'createdAt', direction = 'desc') => {
    const params = { keyword, pageNum, sort, direction };
    if (pageSize !== undefined && pageSize !== null) {
        params.pageSize = pageSize;
    }
    return await axios.get(`${BASE_URL}/board/search`, { params });
  };
  
//게시글 상세 내용 가져오기
export const getBoardDetail = async (boardId) => {
    return await axios.get(`${BASE_URL}/board/getDetail`, {
        params: { boardId },
        withCredentials: true
    }
    );
};

//특정 사용자 게시물 목록 가져오기
export const getUserBoard = async (pageNum, pageSize) => {
    const params = { pageNum };
    if (pageSize !== undefined && pageSize !== null) {
        params.pageSize = pageSize;
    }
    return await axiosInstance.get(
        `${BASE_URL}/board/getUser`,
        { params }
    );
};

//게시글 수정
export const updateBoard = async (boardId, title, content, newFiles = [], deleteFileNames = []) => {
    const formData = new FormData();
    formData.append('boardId', boardId);
    formData.append('title', title);
    formData.append('content', content);

    newFiles.forEach(file => {
        formData.append('newFiles', file);
    });

    deleteFileNames.forEach(name => {
        formData.append('deleteFileNames', name);
    });

    return await axiosInstance.put(
        `${BASE_URL}/board/update`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};
