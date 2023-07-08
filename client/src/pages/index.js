import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Layout from '../components/layout';
import Sidebar from '../components/sidebar';
import Carousel from '../components/carousel';
import { getLatestEvent } from '../actions/event';
import Event from '../components/event/get';
import { useRouter } from 'next/router';
import Footer from '../components/footer';

const Home = ({ events }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/event');
  };
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
              <section className={styles.content}>
                <div className={styles.header}>Featured Events</div>
                <div className={styles.event}>
                  <Event events={events} />
                </div>
                <div className={styles.btn_container}>
                  <button className={styles.button} onClick={handleClick}>
                    See more
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Layout>
  );
};

export const getServerSideProps = async () => {
  try {
    const events = await getLatestEvent(16);
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
