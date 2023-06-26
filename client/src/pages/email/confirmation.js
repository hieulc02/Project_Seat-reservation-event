import { useEffect, useState } from 'react';
import { verifyEmail } from '../../actions/authentication';
import styles from '../../styles/email.module.scss';

const EmailConfirm = ({ code }) => {
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    const emailConfirm = async () => {
      try {
        const res = await verifyEmail(code);
        setStatus(res.status);
        setIsValid(true);
      } catch (e) {
        setStatus(e.response?.data?.error);
        setIsValid(false);
      }
    };
    emailConfirm();
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div>{`${status}${isValid ? '✅' : '❌'}`}</div>
        {isValid ? (
          <div>Please head back to the main page to continue logging in.</div>
        ) : (
          <div>Please reconfirm your email!</div>
        )}
      </div>
    </>
  );
};
export const getServerSideProps = async ({ query }) => {
  const { code } = query;
  return {
    props: {
      code,
    },
  };
};
export default EmailConfirm;
