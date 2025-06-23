import styles from './Pagination.module.css';

export default function Pagination({ pageNum, totalPages, onPageChange }) {
  // 한 번에 보이는 페이지 수 (15개)
  const pageRange = 15;
  const startPage = Math.floor(pageNum / pageRange) * pageRange;
  const endPage = Math.min(startPage + pageRange, totalPages);

  const pageList = [];
  for (let i = startPage; i < endPage; i++) {
    pageList.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.arrow}
        onClick={() => onPageChange(0)}
        disabled={pageNum === 0}
        aria-label="처음"
      >
        ◀◀
      </button>
      <button
        className={styles.arrow}
        onClick={() => onPageChange(Math.max(0, pageNum - 1))}
        disabled={pageNum === 0}
        aria-label="이전"
      >
        ◀
      </button>
      {pageList.map((num) => (
        <button
          key={num}
          className={num === pageNum ? styles.current : styles.page}
          onClick={() => onPageChange(num)}
          disabled={num === pageNum}
        >
          {num + 1}
        </button>
      ))}
      <button
        className={styles.arrow}
        onClick={() => onPageChange(Math.min(totalPages - 1, pageNum + 1))}
        disabled={pageNum + 1 >= totalPages}
        aria-label="다음"
      >
        ▶
      </button>
      <button
        className={styles.arrow}
        onClick={() => onPageChange(totalPages - 1)}
        disabled={pageNum + 1 >= totalPages}
        aria-label="마지막"
      >
        ▶▶
      </button>
    </div>
  );
}
