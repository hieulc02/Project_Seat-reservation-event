import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout';
import { useState } from 'react';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer hideProgressBar={true} autoClose={1000} />
      </Layout>
    </>
  );
}

export default MyApp;
