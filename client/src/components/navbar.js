import Link from 'next/link';
import styles from '../styles/navbar.module.scss';
import DropDownMenu from './dropdown';
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
          <div className={styles.reservation}>
            <Link href="/event/add-event">Create Event</Link>
          </div>
        </div>
        <DropDownMenu />
      </div>
    </>
  );
};

export default Navbar;
