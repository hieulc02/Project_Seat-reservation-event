import { useState, useEffect } from 'react';
import { vnPayReturn, momoReturn } from '../../../actions/payment';
import Loading from '../../../components/loading';
import Layout from '../../../components/layout';
import styles from '../../../styles/vnpay.module.scss';
const VnPayReturn = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    const checkSum = async () => {
      try {
        let res;

        res = await vnPayReturn();
        if (res) {
          if (res.code === '00') {
            setStatus(
              'Your payment was successfully processed. Thank you for your purchase!✅'
            );
            return;
          }
          setStatus(
            'We apologize, but there was an issue processing your payment. Please try again or contact our support team for assistance.❌'
          );
          return;
        }

        res = await momoReturn();
        if (res.resultCode === '0') {
          setStatus(res.message);
        } else {
          setStatus(res.error);
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
      <div className={styles.container}>{status && status}</div>{' '}
    </Layout>
  );
};

export default VnPayReturn;
