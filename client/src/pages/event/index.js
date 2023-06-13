import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllEvent } from '../../actions/event';
import Layout from '../../components/layout';
import styles from '../../styles/event.module.scss';
import Loading from '../../components/loading';
import React from 'react';
import moment from 'moment';
import io from 'socket.io-client';
import apiEndpoint from '../../apiConfig';
const ShowEvents = ({ events }) => {
  const socket = useRef(null);
  const [data, setData] = useState(events);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getAllEvent();
        const d = docs.map((doc) => doc);
        setData(d);
      } catch (e) {
        console.log(e);
      }
    };
    if (!events) {
      fetchData();
    }
  }, [events]);
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(apiEndpoint, { transports: ['websocket'] });
    }
    if (socket.current) {
      socket.current?.on('event-update', (updatedEvent) => {
        setData((prevData) => [...prevData, updatedEvent]);
      });
    }
  }, []);
  const isFull = data?.every((event) => event.seatAvailable === 0);

  return (
    <>
      <Layout>
        {!data && <Loading />}
        <div className={styles.headerCardItem}>Events</div>
        {data?.length === 0 && (
          <div className={styles.isEventAvailable}>
            There are no shows or events scheduled for today. Please check back
            for future updates.
          </div>
        )}
        {data?.length > 0 && isFull && (
          <div className={styles.isEventAvailable}>
            We regret to inform you that all seats for the event are fully
            booked, and there are no more available spots for reservations.😢
          </div>
        )}
        <div className={styles.wrapper}>
          <div className={styles.container}>
            {data &&
              data.map((event, i) => (
                <React.Fragment key={i}>
                  {event.seatAvailable > 0 &&
                    (event.status === 'approved' ||
                      event?.tempStatus === 'approved') && (
                      <div key={event._id}>
                        <div className={styles.eventCard}>
                          <Link
                            href={`/event/${event._id}`}
                            className={styles.eventLink}
                          >
                            <div className={styles.image}>
                              <img
                                src={event.image}
                                alt="event picture"
                                style={{
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  width: '100%',
                                }}
                              />
                            </div>
                            <div className={styles.eventName}>{event.name}</div>
                          </Link>
                          <div className={styles.eventPriceAndDate}>
                            <div className={styles.price}>
                              {event.ticketPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </div>
                            <div className={styles.date}>
                              <span className={styles.calendarIcon}>📅</span>
                              {moment(event.dateStart).format('DD/MM/YYYY')}
                            </div>
                          </div>
                          <div className={styles.eventTotalAndVenue}>
                            <div className={styles.eventSeat}>
                              {event.seatAvailable} seats left
                            </div>
                            <div className={styles.venue}>{event.venue}</div>
                          </div>
                        </div>
                      </div>
                    )}
                </React.Fragment>
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
};
export const getServerSideProps = async () => {
  const events = await getAllEvent();
  return {
    props: {
      events,
    },
  };
};
export default ShowEvents;
