import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ButtonLogout from '../components/logout';
import { logout } from '../actions/authentication';
import Router from 'next/router';
import Navbar from '../components/navbar';

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <Head>
        <title>BOOKING</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to my first project</h1>
        <div>
          <ButtonLogout />
        </div>
      </main>
    </div>
  );
}
