import React, { useState, useEffect } from 'react';
import { login } from '../actions/authentication';
import Router from 'next/router';
import Link from 'next/link';
import styles from '../styles/auth.module.scss';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errors, setErrors] = useState('');

  useEffect(() => {
    setErrors('');
  }, [email, userPassword]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, userPassword);
      if (!user) return;
      toast.success(user.status);
      Router.push('/');
    } catch (e) {
      //   console.log(e);
      //  setErrors(e.response.data.error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Login</h1>
        <div className={styles.main}>
          <label htmlFor="email" className={styles.label}>
            Email address
          </label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoFocus
          />
        </div>
        <div className={styles.main}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            className={styles.input}
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        {errors && <div className={styles.error}>{errors}</div>}
        <div className={styles.cont_button}>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </div>
        <p className={styles.ref}>
          Don't have an account?{' '}
          <Link className={styles.link} href="/signup">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
