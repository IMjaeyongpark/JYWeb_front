import React, { useState } from "react";
import { updateComment } from '../../api/comment';
import styles from './CommentEditInput.module.css';

export default function CommentEditInput({ comment, onSuccess, onCancel }) {
  const [content, setContent] = useState(comment.content);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await updateComment(comment.commentId, content);
      onSuccess();
    } catch (err) {
      alert('댓글 수정 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        className={styles.editInput}
        autoFocus
      />
      <button type="submit" className={styles.editBtn}>저장</button>
      <button type="button" onClick={onCancel} className={styles.cancelBtn}>취소</button>
    </form>
  );
}
