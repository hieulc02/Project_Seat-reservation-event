import React, { useState, useEffect } from 'react';
import { signup } from '../actions/authentication';
import Router from 'next/router';
import styles from '../styles/auth.module.scss';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Register = () => {
  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState('');
  const { name, email, password, passwordConfirm } = info;

  useEffect(() => {
    setErrors('');
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signup(info);
      toast.success(user.status);
      toast.success(
        'We have sent an email confirmation to your email. Please confirm to log in'
      );
      if (!user) return;
      Router.push(`/login`);
    } catch (e) {
      setErrors(e.response?.data?.error);
    }
  };
  const handleChange = (name) => {
    return (e) => {
      setInfo({ ...info, [name]: e.target.value });
    };
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Sign up</h1>
        <div className={styles.main}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleChange('name')}
            placeholder="Your name"
            className={styles.input}
            autoFocus
          />
        </div>
        <div className={styles.main}>
          <label htmlFor="email" className={styles.label}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={handleChange('email')}
            placeholder="Email address"
            className={styles.input}
          />
        </div>
        <div className={styles.main}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handleChange('password')}
            placeholder="Password"
            className={styles.input}
          />
        </div>
        <div className={styles.main}>
          <label htmlFor="passwordConfirm" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={handleChange('passwordConfirm')}
            placeholder="Password confirm"
            className={styles.input}
          />
        </div>
        {errors && <div className={styles.error}>{errors}</div>}
        <div className={styles.cont_button}>
          <button type="submit" className={styles.button}>
            Sign up
          </button>
        </div>
        <p className={styles.ref}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
