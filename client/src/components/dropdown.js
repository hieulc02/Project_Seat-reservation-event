import { useState, useRef, useEffect } from 'react';
import { logout } from '../actions/authentication';
import { toast } from 'react-toastify';
import Router from 'next/router';
import styles from '../styles/dropdown.module.scss';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTicketAlt,
  FaCalendarCheck,
} from 'react-icons/fa';

import { getMe } from '../actions/authentication';
const DropDown = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMe();
        setUser(res.doc);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  const handleOpen = () => {
    setOpen((prevState) => !prevState);
  };
  const handleLogOut = async () => {
    try {
      const res = await logout();
      toast.success(res.status);
    } catch (e) {
      console.log(e);
      toast.error(res?.error);
    }
  };
  const handleUpdate = () => {
    Router.push('/profile');
  };
  const handleReservation = () => {
    Router.push('/reservation');
  };
  const handleMyEvent = () => {
    Router.push(`/event/user/${user?.name}`);
  };
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className={styles.container} onClick={handleOpen} ref={menuRef}>
        <div className={styles.header}>
          {user?.name && user.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.dropdown}>
          {open && (
            <div className={styles.option}>
              <div onClick={handleUpdate} className={styles.profile}>
                {' '}
                <FaUserCircle />
                Profile
              </div>
              <div onClick={handleReservation} className={styles.reservation}>
                {' '}
                <FaTicketAlt />
                Reservation
              </div>
              <div onClick={handleMyEvent} className={styles.event}>
                <FaCalendarCheck />
                Event
              </div>
              <div onClick={handleLogOut} className={styles.logout}>
                {' '}
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DropDown;
