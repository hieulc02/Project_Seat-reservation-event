import Head from 'next/head';
import React, { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';
import ButtonLogout from '../components/logout';
import Layout from '../components/layout';
import axios from 'axios';
import apiEndpoint from '../apiConfig';
import { cookies } from 'next/dist/client/components/headers';
// import Link from 'next/link';

const Home = ({ user }) => {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Event Seat Reservation</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div>
            <h1 className={styles.title}>Welcome back {user?.name}</h1>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({ req }) => {
  let jwtString = null;
  const keyValuePairs = req.headers?.cookie?.split('; ');
  if (keyValuePairs) {
    for (const pair of keyValuePairs) {
      if (pair.startsWith('jwt=')) {
        jwtString = pair.substring(4);
        break;
      }
    }
  } else {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  try {
    const res = await axios.get(`${apiEndpoint}/api/users/me`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwtString}` },
    });
    const user = res.data.doc;
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      props: {
        user,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default Home;
