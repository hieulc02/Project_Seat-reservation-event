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
        const res = await momoReturn();
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
