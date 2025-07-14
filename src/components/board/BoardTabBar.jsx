import React from 'react';
import styles from './BoardTabBar.module.css'; // 아래 CSS 참고
import { useNavigate } from 'react-router-dom';

export default function BoardTabBar() {
  const navigate = useNavigate();

  return (
    <div className={styles.tabBarWrapper}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>전체글</button>
      </div>
      <div className={styles.rightGroup}>
        <button
          className={styles.writeBtn}
          onClick={() => navigate('/board/create')}>
          글쓰기
        </button>
      </div>
    </div>
  );
}
