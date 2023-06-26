import React, { useEffect, useRef, useState } from 'react';
import {
  deleteEvent,
  getAllEventsPending,
  updateEventStatus,
} from '../../actions/event';
import styles from '../../styles/waitingList.module.scss';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import apiEndpoint from '../../apiConfig';
import Layout from '../../components/layout';
import Link from 'next/link';
import { checkAuthentication } from '../../auth';
import Loading from '../../components/loading';
import NavbarAdmin from '../../components/navbar_admin';

const WaitingList = () => {
  const socket = useRef(null);
  const [event, setEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getAllEventsPending();
        const d = docs.map((doc) => doc);
        setEvent(d);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(apiEndpoint, { transports: ['websocket'] });
    }
  }, []);
  const handleApproveClick = async (id, status) => {
    try {
      const res = await updateEventStatus(id, status);
      setEvent((prevEvent) => prevEvent.filter((e) => e._id !== id));
      const updatedEvent = event.find((e) => e._id === id);
      socket.current.emit('event-approve', updatedEvent);
      toast.success(res.status);
    } catch (e) {
      console.log(e);
    }
  };
  const handleDenyClick = async (id, userId) => {
    try {
      const res = await deleteEvent(id, userId);
      setEvent((prevEvent) => prevEvent.filter((e) => e._id !== id));
      toast.success(res.status);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <NavbarAdmin />
      {isLoading && <Loading />}
      <div className={styles.container}>
        <div className={styles.header}>Waiting list</div>
        {!isLoading && event?.length === 0 && (
          <div className={styles.noEvent}>No event pending 😢</div>
        )}
        {event.map((e, i) => (
          <React.Fragment key={i}>
            <div key={e._id} className={styles.waitingList}>
              <div className={styles.header}>
                <label className={styles.label}>Created by:</label>
                <div className={styles.ref}>
                  <Link href={`/event/user/${e.user.name}`}>{e.user.name}</Link>
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
                <label className={styles.label}>Seat: </label>{' '}
                <div className={styles.content}>{e.row * e.col}</div>
              </div>
              <div className={styles.box}>
                <label className={styles.label}>Ticket price: </label>
                <div className={styles.content}>{e.ticketPrice}</div>
              </div>
              <div className={styles.box}>
                <label className={styles.label}>Venue: </label>
                <div className={styles.content}>{e.venue}</div>
              </div>
              <div className={styles.button}>
                <button
                  onClick={() => {
                    handleApproveClick(e._id, true);
                  }}
                  className={styles.approve}
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleDenyClick(e._id, e.user._id);
                  }}
                  className={styles.deny}
                >
                  Deny
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
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
export default WaitingList;
