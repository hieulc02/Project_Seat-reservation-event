import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout';
import { useState } from 'react';
import '../styles/styles.scss';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer hideProgressBar={true} autoClose={1000} />
    </>
  );
}

export default MyApp;
