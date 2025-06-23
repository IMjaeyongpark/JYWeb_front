import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoard } from '../api/board';
import styles from './BoardList.module.css';
import { formatBoardDate } from '../utils/dateFormat';
import Pagination from './Pagination';

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [pageSize] = useState(10);
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
  const goDetail = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div
      style={{
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <h2>게시글 목록</h2>
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
