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
import axios from 'axios';

const WaitingList = () => {
  const socket = useRef(null);
  const [event, setEvent] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getAllEventsPending();
        const d = docs.map((doc) => doc);
        setEvent(d);
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
  const handleDenyClick = async (id) => {
    try {
      const res = await deleteEvent(id);
      setEvent((prevEvent) => prevEvent.filter((e) => e._id !== id));
      toast.success(res.status);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Layout>
      <div className={styles.container}>
        {event.map((e, i) => (
          <React.Fragment key={i}>
            <div key={e._id}>
              <div>
                <label>Name: </label>
                <div>{e.name}</div>
              </div>
              <div>
                <label>Description: </label>
                <div>{e.description}</div>
              </div>
              <div>
                <label>Seat: </label> <div>{e.row * e.col}</div>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  handleApproveClick(e._id, 'approved');
                }}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleDenyClick(e._id);
                }}
              >
                Deny
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Layout>
  );
};

export default WaitingList;
