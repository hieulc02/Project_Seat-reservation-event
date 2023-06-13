import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Layout from '../components/layout';
import axios from 'axios';
import apiEndpoint from '../apiConfig';
import SlideBar from '../components/slideBar';

const Home = ({ user }) => {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Event Seat Reservation</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className={styles.main}>
            <div className={styles.carousel}></div>
            <SlideBar />
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
