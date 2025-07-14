import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBoard, searchBoards } from '../../api/board'; // searchBoards 추가
import styles from './BoardList.module.css';
import { formatBoardDate } from '../../utils/dateFormat';
import Pagination from '../layout/Pagination';
import BoardTabBar from './BoardTabBar';

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  // pageNum, keyword 파라미터 파싱
  const pageNum = parseInt(searchParams.get('page') || '0', 10);
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line
  }, [pageNum, pageSize, keyword]);

  const fetchBoards = async () => {
    try {
      let res;
      if (keyword) {
        res = await searchBoards(keyword, pageNum, pageSize);
      } else {
        res = await getBoard(pageNum, pageSize);
      }
      setBoards(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert('게시글 목록 불러오기 실패');
    }
  };

  const goDetail = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  const handlePageChange = (newPage) => {
    // keyword가 있으면 같이 넘겨야 함
    if (keyword) {
      setSearchParams({ page: newPage, keyword });
    } else {
      setSearchParams({ page: newPage });
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
          {boards.map((board) => (
            <tr className={styles.tr} key={board.boardId}>
              <td className={styles.td}>{board.boardId}</td>
              <td
                className={styles.titleCell}
                onClick={() => goDetail(board.boardId)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {board.title}
              </td>
              <td className={`${styles.td} ${styles.infoCell}`}>{board.userNickname}</td>
              <td className={`${styles.td} ${styles.infoCell}`}>{board.viewCount}</td>
              <td>{formatBoardDate(board.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        pageNum={pageNum}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
