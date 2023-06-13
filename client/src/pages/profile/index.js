import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { updateMe } from '../../actions/authentication';
import axios from 'axios';
import apiEndpoint from '../../apiConfig';
import { toast } from 'react-toastify';

const Profile = ({ user }) => {
  const [updateUser, setUpdateUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setUpdateUser(user);
  }, []);
  const handleSubmit = async (updateUser) => {
    try {
      const res = await updateMe(updateUser);
      setEditMode(false);
      toast.success(res.status);
    } catch (e) {
      console.log(e);
    }
  };
  const handleEdit = () => {
    setEditMode(true);
  };
  return (
    <Layout>
      <div>
        {editMode ? (
          <div>
            <input
              value={updateUser?.name}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, name: e.target.value })
              }
            />
            <input
              value={updateUser?.email}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, email: e.target.value })
              }
            />

            <button onClick={() => handleSubmit(updateUser)}>Update</button>
          </div>
        ) : (
          <div>
            <div>{updateUser?.name}</div>
            <div>{updateUser?.email}</div>
            <button onClick={() => handleEdit()}>Edit</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

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
export default Profile;
