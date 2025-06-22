import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBoardDetail } from '../api/board';
import { getComment } from '../api/comment';

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchBoardDetail();
    fetchComments();
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
      console.log(res.data);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert('댓글 불러오기 실패');
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
