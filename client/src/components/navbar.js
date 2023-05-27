import Link from 'next/link';
import styles from '../styles/navbar.module.scss';
import ButtonLogout from './logout';
const Navbar = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.home}>
            <Link href="/">Home</Link>
          </div>
          <div className={styles.event}>
            <Link href="/event">Event</Link>
          </div>

          <div className={styles.reservation}>
            <Link href="/reservation">Reservation</Link>
          </div>
          <ButtonLogout />
        </div>
      </div>
    </>
  );
};

export default Navbar;
