import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import Layout from '../../../components/layout';
import { getEventUser, updateEvent, deleteEvent } from '../../../actions/event';
import styles from '../../../styles/userEvent.module.scss';
import { checkAuthentication } from '../../../auth';

const UserEvent = ({ username }) => {
  const [event, setEvent] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState(null);

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

  const handleEditClick = (id) => {
    setEditEventId(id);
    setUpdatedEvent(event.find((e) => e._id === id));
    setEditMode(true);
  };

  const handleUpdateClick = async (id, editedEvent) => {
    try {
      const res = await updateEvent(id, editedEvent);
      if (!res) return;
      toast.success(res.status);
      setEditMode(false);
      setEvent((prevEvent) =>
        prevEvent.map((e) => (e._id === id ? editedEvent : e))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteEvent(id);
      setEvent((prevEvent) => prevEvent.filter((e) => e._id !== id));
      toast.success('Event successfully deleted');
    } catch (e) {
      console.log(e);
    }
  };

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
                  <input
                    value={updatedEvent?.name}
                    onChange={(e) =>
                      setUpdatedEvent({
                        ...updatedEvent,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={styles.box}>
                  <label className={styles.label}>Description: </label>
                  <textarea
                    value={updatedEvent?.description}
                    onChange={(e) =>
                      setUpdatedEvent({
                        ...updatedEvent,
                        description: e.target.value,
                      })
                    }
                  />
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
                  <button
                    className={styles.edit}
                    onClick={() => handleUpdateClick(e._id, updatedEvent)}
                  >
                    Update
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
                  <button
                    className={styles.edit}
                    onClick={() => handleEditClick(e._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => handleDeleteClick(e._id)}
                  >
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

export const getServerSideProps = async ({ req, params }) => {
  const { username } = params;
  const authenticationCheck = await checkAuthentication(req);

  if ('redirect' in authenticationCheck) {
    return authenticationCheck;
  }
  return {
    props: {
      username,
    },
  };
};

export default UserEvent;
