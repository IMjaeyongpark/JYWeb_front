import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoard } from '../api/board';
import styles from './BoardList.module.css';
import { formatBoardDate } from '../utils/dateFormat';
import Pagination from './Pagination';
import BoardTabBar from './BoardTabBar';

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
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

  const goDetail = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  const goToCreate = () => {
    navigate('/board/create');
  };

  return (
    // 화면 전체를 flex로 감싸고 세로 방향 중앙 정렬
    <div style={{
      minHeight: '80vh', // 높이조절(원하면 100vh)
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // 세로 중앙
      alignItems: 'center', // 가로 중앙
    }}>
      <BoardTabBar />
      <table className={styles.table} style={{ margin: '0 auto' }}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>번호</th>
            <th className={styles.th}>제목</th>
            <th className={styles.th}>작성자</th>
            <th className={styles.th}>조회수</th>
            <th className={styles.th}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(board => (
            <tr className={styles.tr} key={board.boardId}>
              <td className={styles.td}>{board.boardId}</td>
              <td
                className={styles.titleCell}
                onClick={() => goDetail(board.boardId)}
              >
                {board.title}
              </td>
              <td className={`${styles.td} ${styles.infoCell}`}>{board.userNickname}</td>
              <td className={`${styles.td} ${styles.infoCell}`}>{board.viewCount}</td>
              <td>
                {formatBoardDate(board.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        onPageChange={setPageNum}
      />
    </div>
  );
}
