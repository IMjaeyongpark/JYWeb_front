import { useParams, useNavigate } from 'react-router-dom';
import { updateBoard, getBoardDetail } from '../api/board';
import React, { useState, useEffect } from 'react';


export default function BoardUpdatePage() {


    const { boardId } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchBoardDetail();
    }, [boardId]);

    const fetchBoardDetail = async () => {
        try {
            const res = await getBoardDetail(boardId);
            setTitle(res.data.title)
            setContent(res.data.content)
        } catch (err) {
            alert('게시글 상세 불러오기 실패');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title || !content) {
            setError('제목과 내용을 입력하세요.');
            return;
        }

        try {
            await updateBoard(boardId, title, content); // 실제 API 호출
            setTimeout(() => navigate(`/board/${boardId}`));
        } catch (e) {
            setError('게시글 수정 실패');
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: 16, background: '#fff', borderRadius: 8 }}>
            <h2>게시글 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', marginBottom: 12, padding: 8, fontSize: 18 }}
                    />
                </div>
                <div>
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', minHeight: 200, padding: 8, fontSize: 16 }}
                    />
                </div>
                {error && <div style={{ color: 'red', margin: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', margin: 8 }}>{success}</div>}
                <button type="submit" style={{ marginTop: 12, padding: '8px 32px', fontSize: 16 }}>
                    수정
                </button>
            </form>
        </div>
    );
}
