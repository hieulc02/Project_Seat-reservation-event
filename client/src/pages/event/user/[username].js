import React, { useEffect, useState } from 'react';
import { getEventUser } from '../../../actions/event';
import styles from '../../../styles/userEvent.module.scss';
import moment from 'moment';
import Layout from '../../../components/layout';
const UserEvent = ({ username }) => {
  const [event, setEvent] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEventUser(username);
        setEvent(res.user.event);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  const handleEditClick = () => {};
  const handleDeleteClick = () => {};

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.user}>
          <label className={styles.labelUser}>USER:</label>
          <div className={styles.username}>{event[0]?.user.name}</div>
        </div>
        {event.map((e, i) => (
          <React.Fragment key={i}>
            {editMode && editEventId === e._id ? (
              <div key={e._id} className={styles.wrapper}>
                <div className={styles.box}>
                  <label className={styles.label}>Created at:</label>
                  <div className={styles.content}>
                    {moment(e.createdAt).format('DD/MM/YY hh:mm A')}
                  </div>
                </div>
                <div className={styles.image}>
                  <img
                    src={e.image}
                    alt="event-image"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      width: '100%',
                    }}
                  />
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Name: </label>
                  <div className={styles.content}>{e.name}</div>
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Description: </label>
                  <div className={styles.content}>{e.description}</div>
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Seat: </label>
                  <div className={styles.content}>{e.row * e.col}</div>
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Seat available: </label>
                  <div className={styles.content}>{e.seatAvailable}</div>
                </div>
                <div className={styles.button}>
                  <button className={styles.edit} onClick={handleEditClick}>
                    Edit
                  </button>
                  <button className={styles.delete} onClick={handleDeleteClick}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div key={e._id} className={styles.wrapper}>
                <div className={styles.box}>
                  <label className={styles.label}>Created at:</label>
                  <div className={styles.content}>
                    {moment(e.createdAt).format('DD/MM/YY hh:mm A')}
                  </div>
                </div>
                <div className={styles.image}>
                  <img
                    src={e.image}
                    alt="event-image"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      width: '100%',
                    }}
                  />
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Name: </label>
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Description: </label>
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Seat: </label>
                  <div className={styles.content}>{e.row * e.col}</div>
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Seat available: </label>
                  <div className={styles.content}>{e.seatAvailable}</div>
                </div>
                <div className={styles.button}>
                  <button className={styles.edit} onClick={handleEditClick}>
                    Edit
                  </button>
                  <button className={styles.delete} onClick={handleDeleteClick}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = ({ params }) => {
  const { username } = params;
  return {
    props: {
      username,
    },
  };
};
export default UserEvent;
