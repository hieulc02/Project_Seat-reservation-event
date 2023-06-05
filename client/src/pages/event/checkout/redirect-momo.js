import { useState, useEffect } from 'react';
import { momoReturn } from '../../../actions/payment';
import Loading from '../../../components/loading';
import Layout from '../../../components/layout';
import styles from '../../../styles/vnpay.module.scss';
const VnPayReturn = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const checkSum = async () => {
      try {
        const res = await momoReturn();
        if (res.resultCode === '0') {
          setData(res.data);
          setAmount(res.amount);
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
      <div className={styles.container}>
        {status && (
          <div>
            <div>Amount: </div>
            <div>{amount}</div>
            <div>{data?.eventId.name}</div>
            <div>Seat: </div>
            <div>
              {data?.seats.map((s, i) => (
                <React.Fragment key={i}>
                  {s.row}-{s.col}
                </React.Fragment>
              ))}
            </div>
            <div>Total: </div>
            <div>{data?.total}</div>
            <div>{status}</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VnPayReturn;
