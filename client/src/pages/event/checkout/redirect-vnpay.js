import React, { useState, useEffect } from 'react';
import { vnPayReturn } from '../../../actions/payment';
import Loading from '../../../components/loading';
import Layout from '../../../components/layout';
import styles from '../../../styles/resultCheckout.module.scss';

const VnPayReturn = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const checkSum = async () => {
      try {
        const res = await vnPayReturn();
        if (res.code === '00') {
          setData(res.data);
          setAmount(res.amount);
          setStatus(
            'Your payment was successfully processed. Thank you for your purchase!✅'
          );
        } else {
          setStatus(
            'We apologize, but there was an issue processing your payment. Please try again or contact our support team for assistance.❌'
          );
        }
      } catch (e) {
        console.log(e);
        setStatus(
          'We regret to inform you that an error occurred during the payment process. Kindly contact our support team for further assistance and resolution.❌'
        );
      }
      setLoading(false);
    };
    checkSum();
  }, []);

  return (
    <Layout>
      {loading && <Loading />}
      <div className={styles.container}>
        {status && (
          <div className={styles.wrapper}>
            <div className={styles.box}>
              <div className={styles.label}>Amount:</div>
              <div className={styles.content}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(amount)}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.label}>Event:</div>
              <div className={styles.content}>{data?.eventId.name}</div>
            </div>
            <div className={styles.box}>
              <div className={styles.label}>Seat:</div>
              <div className={styles.content}>
                {data?.seats.map((s, i) => (
                  <React.Fragment key={i}>
                    {i === data?.seats.length - 1
                      ? `${s.row}-${s.col}`
                      : `${s.row}-${s.col}, `}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.label}>Total:</div>
              <div className={styles.content}>{data?.total}</div>
            </div>
            <div>{status}</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VnPayReturn;
