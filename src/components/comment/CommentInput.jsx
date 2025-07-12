import { useState } from 'react';
import { createComment } from '../../api/comment';

import styles from './CommentInput.module.css';

export default function CommentInput({ boardId, parentId, onSuccess, autoFocus = false }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('댓글을 입력하세요.');
            return;
        }
        setLoading(true);
        try {
            await createComment(boardId, content, parentId);
            setContent('');
            onSuccess && onSuccess();
        } catch (err) {
            alert('댓글 등록 실패');
        }
        setLoading(false);
    };

    return (
        <div>
        <form onSubmit={handleSubmit} className={styles.commentForm}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                className={styles.commentTextarea}
                placeholder={parentId ? "답글을 입력하세요" : "댓글을 입력하세요"}
                autoFocus={autoFocus}
            />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
                등록
            </button>
        </form>
        </div>
    );
}