import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../api/board';
import FileUploader from '../components/board/FileUploader';
import styles from './BoardCreatePage.module.css';

export default function BoardCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !content) {
      setError('제목과 내용을 입력하세요.');
      return;
    }
    try {
      await createBoard(title, content, files);
      navigate('/');
    } catch (e) {
      setError('게시글 등록 실패');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className={styles.textarea}
          placeholder="내용"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <FileUploader onChange={setFiles} />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submitBtn}>등록</button>
      </form>
    </div>
  );
}
