import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBoard, searchBoards } from '../../api/board';
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

  // 검색 및 정렬 관련 파라미터
  const pageNum = parseInt(searchParams.get('page') || '0', 10);
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const direction = searchParams.get('direction') || 'desc';

  useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line
  }, [pageNum, pageSize, keyword, sort, direction]);

  const fetchBoards = async () => {
    try {
      let res;
      if (keyword) {
        res = await searchBoards(keyword, pageNum, pageSize, sort, direction);
      } else {
        res = await getBoard(pageNum, pageSize, sort, direction);
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
    setSearchParams({
      page: newPage,
      keyword,
      sort,
      direction,
    });
  };

  const handleSortChange = (e) => {
    setSearchParams({
      page: 0,
      keyword,
      sort: e.target.value,
      direction,
    });
  };

  const handleDirectionToggle = () => {
    setSearchParams({
      page: 0,
      keyword,
      sort,
      direction: direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '80px'
      }}
    >
      <BoardTabBar />

      <div className={styles.sortBar}>
        <label>정렬 기준:</label>
        <select className={styles.sortSelect} value={sort} onChange={handleSortChange}>
          <option value="createdAt">최신순</option>
          <option value="viewCount">조회수순</option>
          <option value="likeCount">좋아요순</option>
        </select>
        <button className={styles.sortButton} onClick={handleDirectionToggle}>
          {direction === 'asc' ? '오름차순 ▲' : '내림차순 ▼'}
        </button>
      </div>


      <table className={styles.table} style={{ margin: '0 auto' }}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>번호</th>
            <th className={styles.th}>제목</th>
            <th className={styles.th}>작성자</th>
            <th className={styles.th}>조회수</th>
            <th className={styles.th}>좋아요</th>
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
              <td className={`${styles.td} ${styles.infoCell}`}>{board.likeCount ?? 0}</td>
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
