import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBoardDetail, deleteBoard, likeBoard, unlikeBoard } from '../api/board';
import { getComment, deleteComment } from '../api/comment';
import styles from './BoardDetailPage.module.css';
import CommentInput from '../components/comment/CommentInput';
import CommentEditInput from '../components/comment/CommentEditInput';
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [pageNum] = useState(0);
  const [pageSize] = useState(10);
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [editOpenId, setEditOpenId] = useState(null);

  // 좋아요 관련 state
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const currentUserId = localStorage.getItem('loginId');

  useEffect(() => {
    fetchBoardDetail();
    fetchComments();
    // eslint-disable-next-line
  }, [boardId]);

  // 게시글 상세 정보 + 좋아요 상태/개수 세팅
  const fetchBoardDetail = async () => {
    try {
      const res = await getBoardDetail(boardId);
      setBoard(res.data);
      setLikeCount(res.data.likeCount ?? 0);   // likeCount number
      setLiked(res.data.liked ?? false);       // liked boolean
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

  // 좋아요/취소 처리
  const handleLike = async () => {
    try {
      if (!currentUserId) {
        alert('로그인 후 이용 가능합니다.');
        return;
      }
      if (!liked) {
        const res = await likeBoard(boardId);
        setLikeCount(res.data.likeCount);
        setLiked(true);
      } else {
        const res = await unlikeBoard(boardId);
        setLikeCount(res.data.likeCount);
        setLiked(false);
      }
    } catch (err) {
      alert('좋아요 처리 실패');
    }
  };

  const renderComment = (comment, depth = 0) => (
    <div key={comment.commentId} style={{ marginBottom: '16px' }}>
      <div
        className={`${styles.commentItem} ${depth > 0 ? styles.replyItem : ''}`}
        style={{ paddingLeft: depth * 20 }}
      >
        <div className={styles.commentHeader}>
          <span className={styles.commentUser}>{comment.userNickname}</span>
          <span className={styles.commentDate}>{comment.createdAt?.replace('T', ' ').slice(5, 16)}</span>
          {!comment.deletedAt && comment.loginId === currentUserId && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button
                className={styles.commentEdit}
                onClick={() => setEditOpenId(prev => prev === comment.commentId ? null : comment.commentId)}
              >수정</button>
              <button
                className={styles.commentDelete}
                onClick={() => handleDeleteComment(comment.commentId)}
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
            <span style={{ color: '#bbb', fontStyle: 'italic' }}>삭제되었습니다</span>
          ) : (
            comment.content
          )}
        </div>
        {!comment.deletedAt && currentUserId && (
          <button
            className={styles.replyBtn}
            onClick={() => replyOpenId === comment.commentId ? handleReplyClose() : handleReplyOpen(comment.commentId)}
          >답글</button>
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
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {comment.replies.map(reply => renderComment(reply, 1))}
        </div>
      )}
    </div>
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
      {board.fileUrls && board.fileUrls.length > 0 && (
        <div className={styles.attachArea}>
          <h4 className={styles.attachTitle}>첨부파일</h4>
          <ul className={styles.attachList}>
            {board.fileUrls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" download>
                  {decodeURIComponent(url.split('/').pop())}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.likeArea} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '20px 0 24px 0'
      }}>
        <button
          className={styles.likeBtn}
          onClick={handleLike}
          disabled={!currentUserId}
          style={{
            background: 'none',
            border: 'none',
            cursor: currentUserId ? 'pointer' : 'not-allowed',
            fontSize: '22px',
            color: liked ? '#e74c3c' : '#bbb',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <span style={{ fontSize: '1.13rem', fontWeight: 500 }}>{likeCount}</span>
      </div>
      <h3>댓글</h3>
      <div style={{ marginTop: 20 }}>
        {comments.length === 0 ? (
          <p className={styles.noComment}>댓글이 없습니다.</p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
        {currentUserId && (
          <CommentInput
            boardId={boardId}
            onSuccess={fetchComments}
          />
        )}
      </div>
      <div style={{ paddingBottom: '100px' }} />
    </div>
  );  
}
