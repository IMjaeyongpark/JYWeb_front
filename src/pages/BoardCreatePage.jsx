import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../api/board'; // 실제 API 함수 import

export default function BoardCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('제목과 내용을 입력하세요.');
      return;
    }

    try {
      await createBoard( title, content ); // 실제 API 호출
      setTimeout(() => navigate('/')); // 0.8초 뒤 목록으로 이동
    } catch (e) {
      setError('게시글 등록 실패');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 16, background: '#fff', borderRadius: 8 }}>
      <h2>글쓰기</h2>
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
          등록
        </button>
      </form>
    </div>
  );
}
