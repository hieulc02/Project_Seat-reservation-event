import React from 'react';
import Layout from '../../components/layout';
import UpdateEvent from '../../components/event/update';
import { checkAuthentication } from '../../auth';

const Admin = () => {
  return (
    <Layout>
      <UpdateEvent />
    </Layout>
  );
};
export const getServerSideProps = async ({ req }) => {
  const authenticationCheck = await checkAuthentication(req);

  if ('redirect' in authenticationCheck) {
    return authenticationCheck;
  }
  const user = authenticationCheck?.user;
  if (user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      user,
    },
  };
};
export default Admin;
