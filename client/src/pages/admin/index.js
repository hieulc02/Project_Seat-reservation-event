import React from 'react';
import NavbarAdmin from '../../components/navbar_admin';
import UpdateEvent from '../../components/event/update';
import { checkAuthentication } from '../../auth';

const Admin = () => {
  return (
    <>
      <NavbarAdmin />
      <UpdateEvent />
    </>
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
