import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBoardDetail, deleteBoard } from '../api/board';
import { getComment } from '../api/comment';

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize] = useState(10);

  // 로그인한 유저의 loginId
  const currentUserId = localStorage.getItem('loginId');

  useEffect(() => {
    fetchBoardDetail();
    fetchComments();
    // eslint-disable-next-line
  }, [boardId, pageNum]);

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

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteBoard(board.boardId);
      alert('삭제되었습니다.');
      navigate('/'); // 홈 또는 게시판 목록
    } catch (err) {
      alert('삭제 실패');
    }
  };

  if (!board) return <div>로딩중...</div>;

  return (
    <div>
      <h2>{board.title}</h2>
      <div>
        <span>작성자: {board.userNickname}</span>
        <span style={{ marginLeft: '20px' }}>조회수: {board.viewCount}</span>
        <span style={{ marginLeft: '20px' }}>{board.createdAt?.split('T')[0]}</span>
      </div>
      {/* 삭제 버튼: 본인 글일 때만 노출 */}
      {board.loginId === currentUserId && (
        <button onClick={handleDelete} style={{ margin: '1em 0', color: 'red' }}>삭제</button>
      )}
      <hr />
      <div style={{ minHeight: '200px', margin: '1em 0' }}>{board.content}</div>
      <hr />
      <h3>댓글</h3>
      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments.map(comment => (
            <li key={comment.commentId}>
              <strong>{comment.userNickname}</strong> ({comment.createdAt?.split('T')[0]})
              <div>{comment.content}</div>
            </li>
          ))}
        </ul>
      )}
      {/* 페이지네이션, 댓글 작성 폼 등 추가 가능 */}
    </div>
  );
}
