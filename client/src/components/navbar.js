import Link from 'next/link';
import styles from '../styles/navbar.module.scss';
import DropDownMenu from './dropdown';
import QueryEvent from './event/query';
import AppConfig from '../config/appConfig';
const { LOGO } = AppConfig;
const Navbar = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <Link href="/">
                <img
                  src={LOGO.url}
                  alt="event picture"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    borderRadius: '10px',
                  }}
                />
              </Link>
            </div>
            <div className={styles.query}>
              <QueryEvent />
            </div>
          </div>
          <div className={styles.control}>
            <Link href="/event/add-event">
              <div className={styles.createEvent}>Create Event</div>
            </Link>
          </div>
        </div>
        <DropDownMenu />
      </div>
    </>
  );
};

export default Navbar;
