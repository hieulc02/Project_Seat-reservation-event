import { useEffect } from 'react';
import { verifyEmail } from '../../actions/authentication';

const EmailConfirm = ({ code }) => {
  useEffect(() => {
    const emailConfirm = async () => {
      try {
        const res = await verifyEmail(code);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };
    emailConfirm();
  }, []);
  return (
    <>
      <div>Successful</div>
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
