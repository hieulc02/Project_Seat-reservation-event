import Link from 'next/link';
import styles from '../styles/sidebar.module.scss';
import { FaHome, FaCalendarDay, FaInfoCircle } from 'react-icons/fa';
const Sidebar = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <ul>
            <li>
              <Link href="/">
                <div className={styles.box}>
                  <FaHome />
                  <div>Home</div>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/event">
                <div className={styles.box}>
                  <FaCalendarDay />
                  <div>Event</div>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/">
                <div className={styles.box}>
                  <FaInfoCircle />
                  <div>On me?</div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
