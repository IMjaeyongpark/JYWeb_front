import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoard } from '../api/board'; // API 경로에 맞게 수정

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line
  }, [pageNum, pageSize]);

  const fetchBoards = async () => {
    try {
      const res = await getBoard(pageNum, pageSize);
      setBoards(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert('게시글 목록 불러오기 실패');
    }
  };

  const handlePrev = () => setPageNum(prev => Math.max(prev - 1, 0));
  const handleNext = () => setPageNum(prev => (prev + 1 < totalPages ? prev + 1 : prev));
  const goDetail = (boardId) => {
    // /board/:boardId로 이동
    navigate(`/board/${boardId}`);
  };

  return (
    <div style={{marginTop: '2rem'}}>
      <h2>게시글 목록</h2>
      <table border="1" cellPadding={8} cellSpacing={0} style={{width: "100%", textAlign: "center"}}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(board => (
            <tr key={board.boardId}>
              <td>{board.boardId}</td>
              <td
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => goDetail(board.boardId)}
              >
                {board.title}
              </td>
              <td>{board.userNickname}</td>
              <td>{board.viewCount}</td>
              <td>{board.createdAt?.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handlePrev} disabled={pageNum === 0}>이전</button>
        <span style={{ margin: '0 10px' }}>{pageNum + 1} / {totalPages}</span>
        <button onClick={handleNext} disabled={pageNum + 1 >= totalPages}>다음</button>
      </div>
    </div>
  );
}
