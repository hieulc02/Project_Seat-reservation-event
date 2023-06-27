import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Layout from '../components/layout';
import Sidebar from '../components/sidebar';
import Carousel from '../components/carousel';
import { getAllEvent } from '../actions/event';

const Home = ({ events }) => {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Event Seat Reservation</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <nav className={styles.nav}>
          <Sidebar />
        </nav>
        <main>
          <div className={styles.wrapper}>
            <div className={styles.main}>
              <div className={styles.carousel}>
                <Carousel events={events} />
              </div>
            </div>
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
    const events = await getAllEvent();
    return {
      props: {
        events,
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
