import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { updateMe } from '../../actions/authentication';
import { toast } from 'react-toastify';
import styles from '../../styles/profile.module.scss';
import { checkAuthentication } from '../../auth';

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
      <div className={styles.container}>
        {editMode ? (
          <div className={styles.wrapper}>
            <div className={styles.box}>
              <label className={styles.label}>Name: </label>
              <div className={styles.content}>
                <input
                  value={updateUser?.name}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className={styles.box}>
              <label className={styles.label}>Email: </label>
              <div className={styles.content}>
                <input
                  value={updateUser?.email}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className={styles.button}>
              <button
                className={styles.update}
                onClick={() => handleSubmit(updateUser)}
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.wrapper}>
            <div className={styles.box}>
              <label className={styles.label}>Name:</label>
              <div className={styles.content}>{updateUser?.name}</div>
            </div>
            <div className={styles.box}>
              <div className={styles.label}>Email: </div>
              <div className={styles.content}>{updateUser?.email}</div>
            </div>
            <div className={styles.button}>
              <button className={styles.update} onClick={() => handleEdit()}>
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

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
export default Profile;
