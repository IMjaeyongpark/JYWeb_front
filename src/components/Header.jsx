import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const goHome = () => navigate('/');

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.logo} onClick={goHome}>Home</span>
        <input className={styles.search} placeholder="검색" />
      </div>
      
      <nav className={styles.nav}>
        <a href="#">갤러리</a>
        <a href="#">마이너갤</a>
        <a href="#">미니갤</a>
        <a href="#">인물갤</a>
        <a href="#">갤로그</a>
        <a href="#">디시트렌드</a>
      </nav>
    </header>
  );
}
