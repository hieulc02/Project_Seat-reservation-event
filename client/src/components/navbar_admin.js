import Link from 'next/link';
import styles from '../styles/navbar.module.scss';
import DropDownMenu from './dropdown';
import AppConfig from '../config/appConfig';
const { LOGO } = AppConfig;
const NavbarAdmin = () => {
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
          </div>
          <div className={styles.control}>
            <Link href="/admin">
              <div className={styles.eventAdmin}>Event Management</div>
            </Link>
            <Link href="/admin/waiting-list">
              <div className={styles.waitingList}>Waiting List</div>
            </Link>
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

export default NavbarAdmin;
