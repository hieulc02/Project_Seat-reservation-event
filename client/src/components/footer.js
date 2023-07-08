import styles from '../styles/footer.module.scss';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.col_1}>
          <div className={styles.header}>About us</div>
          <div className={styles.content}>
            Streamlined and user-friendly booking platform for easy
            reservations, secure payments, and convenient management of
            bookings.
          </div>
          <div>Book. Reserve. Enjoy.</div>
        </div>
        <div className={styles.col_2}>
          <div className={styles.header}>Contact info</div>
          <div>VNU-HCM University of information technology</div>
          <div className={styles.header}>Email</div>
          <div className={styles.email}>
            <MdEmail />
            <div>20521319@gm.uit.edu.vn</div>
          </div>
        </div>
        <div className={styles.col_3}>
          <div className={styles.header}>Follow us</div>
          <div className={styles.icon}>
            <FaFacebook />
            <FaInstagram />
          </div>
        </div>
      </div>
      <div className={styles.end}>
        &copy; 2023 by TicketDiv. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
