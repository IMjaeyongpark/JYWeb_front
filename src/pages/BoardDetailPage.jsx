import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBoardDetail, deleteBoard } from '../api/board';
import { getComment, deleteComment } from '../api/comment';
import styles from './BoardDetailPage.module.css';
import CommentInput from '../components/CommentInput';
import CommentEditInput from '../components/CommentEditInput'; // (아래 코드 참고)

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [pageNum] = useState(0);
  const [pageSize] = useState(10);
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [editOpenId, setEditOpenId] = useState(null);

  const currentUserId = localStorage.getItem('loginId');

  useEffect(() => {
    fetchBoardDetail();
    fetchComments();
    // eslint-disable-next-line
  }, [boardId]);

  const fetchBoardDetail = async () => {
    try {
      const res = await getBoardDetail(boardId);
      setBoard(res.data);
    } catch (err) {
      alert('게시글 상세 불러오기 실패');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComment(boardId, pageNum, pageSize);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert('댓글 불러오기 실패');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      alert('댓글 삭제 실패');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteBoard(board.boardId);
      alert('삭제되었습니다.');
      navigate('/');
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const goUpdate = () => {
    navigate(`/board/update/${board.boardId}`);
  };

  const handleReplyOpen = (commentId) => setReplyOpenId(commentId);
  const handleReplyClose = () => setReplyOpenId(null);

  // 댓글/대댓글 렌더링 함수
  const renderComment = (comment, depth = 0) => (
    <li
      className={`${styles.commentItem} ${depth === 1 ? styles.replyItem : ''}`}
      key={comment.commentId}
      style={{ marginLeft: depth * 28 }}
    >
      <div className={styles.commentHeader}>
        <span className={styles.commentUser}>{comment.userNickname}</span>
        <span className={styles.commentDate}>{comment.createdAt?.replace('T', ' ').slice(5, 16)}</span>
        {/* 오른쪽 버튼 그룹 */}
        {!comment.deletedAt && comment.loginId === currentUserId && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              type="button"
              className={styles.commentEdit}
              title="댓글 수정"
              onClick={() =>
                editOpenId === comment.commentId
                  ? setEditOpenId(null)
                  : setEditOpenId(comment.commentId)
              }
              aria-label="댓글 수정"
            >수정</button>
            <button
              type="button"
              className={styles.commentDelete}
              title="댓글 삭제"
              onClick={() => handleDeleteComment(comment.commentId)}
              aria-label="댓글 삭제"
            >&times;</button>
          </div>
        )}
      </div>
      <div className={styles.commentContent}>
        {editOpenId === comment.commentId ? (
          <CommentEditInput
            comment={comment}
            onSuccess={() => {
              fetchComments();
              setEditOpenId(null);
            }}
            onCancel={() => setEditOpenId(null)}
          />
        ) : comment.deletedAt ? (
          <span style={{ color: "#bbb", fontStyle: "italic" }}>삭제되었습니다</span>
        ) : (
          comment.content
        )}
      </div>
      {!comment.deletedAt && currentUserId && (
        <button
          className={styles.replyBtn}
          onClick={() =>
            replyOpenId === comment.commentId
              ? handleReplyClose()
              : handleReplyOpen(comment.commentId)
          }
        >
          답글
        </button>
      )}
      {!comment.deletedAt && replyOpenId === comment.commentId && (
        <CommentInput
          boardId={boardId}
          parentId={comment.commentId}
          onSuccess={() => {
            fetchComments();
            handleReplyClose();
          }}
          autoFocus
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul className={styles.commentList}>
          {comment.replies.map(reply => renderComment(reply, 1))}
        </ul>
      )}
    </li>
  );

  if (!board) return <div>로딩중...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{board.title}</h2>
      <div className={styles.infoBar}>
        <div className={styles.infoLeft}>
          <span>작성자: {board.userNickname}</span>
          <span>조회수: {board.viewCount}</span>
          <span>{board.createdAt?.split('T')[0]}</span>
        </div>
        {board.loginId === currentUserId && (
          <div className={styles.actionBtns}>
            <button onClick={handleDelete} className={styles.deleteBtn}>삭제</button>
            <button onClick={goUpdate} className={styles.updateBtn}>수정</button>
          </div>
        )}
      </div>
      <hr />
      <div className={styles.content}>{board.content}</div>
      <hr />
      <h3>댓글</h3>
      <div style={{ marginTop: 20 }}>
        {comments.length === 0 ? (
          <p className={styles.noComment}>댓글이 없습니다.</p>
        ) : (
          <ul className={styles.commentList}>
            {comments.map(comment => renderComment(comment))}
          </ul>
        )}
        {/* 최상위 댓글 입력폼 (로그인시만) */}
        {currentUserId && (
          <CommentInput
            boardId={boardId}
            onSuccess={fetchComments}
          />
        )}
      </div>
      <div style={{
        paddingBottom: "100px"
      }} />
    </div>
  );
}
