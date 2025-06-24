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
        <a href="/">테스트1</a>
        <a href="/">테스트2</a>
      </nav>
    </header>
  );
}
