import Link from 'next/link';
import styles from '../styles/slidebar.module.scss';

const SlideBar = () => {
  return (
    <>
      <div className={styles.container}>
        <ul>
          <li>
            <Link href="/">
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/event">
              <span>Event</span>
            </Link>
          </li>
          <li>
            <Link href="/conference">
              <span>Conference</span>
            </Link>
          </li>
          <li>
            <span>About us</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SlideBar;
