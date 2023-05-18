import Head from 'next/head';
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from '../styles/Home.module.css';
import ButtonLogout from '../components/logout';
import Navbar from '../components/navbar';
import axios from 'axios';
import apiEndpoint from '../apiConfig';
import Link from 'next/link';

const Home = ({ user }) => {
  // const socket = useRef();
  // useEffect(() => {
  //   if (!socket.current) {
  //     socket.current = io(apiEndpoint);
  //   }
  //   if (socket.current) {
  //     socket.current.emit('join', { userId: user._id });
  //   }
  //   document.title = `Welcome, ${user.name}`;
  // }, []);
  return (
    <div className={styles.container}>
      <Navbar />
      <Head>
        <title>BOOKING</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome back {user?.name}</h1>
        <div>
          <ButtonLogout />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  let jwtString = null;
  const keyValuePairs = req.headers.cookie?.split('; ');
  for (const pair of keyValuePairs) {
    if (pair.startsWith('jwt=')) {
      jwtString = pair.substring(4);
      break;
    }
  }
  try {
    const res = await axios.get(`${apiEndpoint}/api/users/me`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwtString}` },
    });
    const user = res.data.doc;
    return {
      props: {
        user,
      },
    };
  } catch (e) {
    return {
      props: {
        user: null,
      },
    };
  }
};

export default Home;
