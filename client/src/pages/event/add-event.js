import Layout from '../../components/layout';
import AddEvent from '../../components/event/add';
import axios from 'axios';
import apiEndpoint from '../../apiConfig';
function CreateEvent({ user }) {
  return (
    <Layout>
      <AddEvent user={user} />
    </Layout>
  );
}

export const getServerSideProps = async ({ req }) => {
  let jwtString = null;
  const keyValuePairs = req.headers?.cookie?.split('; ');
  if (keyValuePairs) {
    for (const pair of keyValuePairs) {
      if (pair.startsWith('jwt=')) {
        jwtString = pair.substring(4);
        break;
      }
    }
  }
  const res = await axios.get(`${apiEndpoint}/api/users/me`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwtString}` },
  });
  const user = res.data.doc;
  return {
    props: {
      user,
    },
  };
};

export default CreateEvent;
