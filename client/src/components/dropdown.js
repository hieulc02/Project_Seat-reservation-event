import { useState, useRef, useEffect } from 'react';
import { logout } from '../actions/authentication';
import { toast } from 'react-toastify';
import Router from 'next/router';
import styles from '../styles/dropdown.module.scss';

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
      <div className={styles.container}>
        <div className={styles.header} onClick={handleOpen} ref={menuRef}>
          Welcome back, {user?.name}
        </div>
        <div className={styles.dropdown}>
          {open && (
            <div>
              <div onClick={handleUpdate}>Profile</div>
              <div onClick={handleLogOut}>Log out</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DropDown;
