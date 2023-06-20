import Layout from '../../components/layout';
import AddEvent from '../../components/event/add';
import { checkAuthentication } from '../../auth';

function CreateEvent({ user }) {
  return (
    <Layout>
      <AddEvent user={user} />
    </Layout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const authenticationCheck = await checkAuthentication(req);

  if ('redirect' in authenticationCheck) {
    return authenticationCheck;
  }
  return {
    props: {
      user: authenticationCheck.user,
    },
  };
};
export default CreateEvent;
