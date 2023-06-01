import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllEvent } from '../../actions/event';
import Layout from '../../components/layout';
import styles from '../../styles/event.module.scss';
import Loading from '../../components/loading';
import React from 'react';

const ShowEvents = ({ events }) => {
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
  const isFull = data?.every((event) => event.seatAvailable === 0);
  return (
    <>
      <Layout>
        {!data && <Loading />}
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
        <div className={styles.headerCardItem}>Events</div>
        <div className={styles.container}>
          {data &&
            data?.map((event, i) => (
              <React.Fragment key={i}>
                {event.seatAvailable > 0 && (
                  <div key={event._id}>
                    <Link
                      href={`/event/${event._id}`}
                      className={styles.eventLink}
                    >
                      <div className={styles.eventCard}>
                        <img
                          src={event.image}
                          alt="event picture"
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            height: '20rem',
                            width: '100%',
                          }}
                        />
                        <p className={styles.eventName}>{event.name}</p>
                        <p className={styles.eventDescription}>
                          {event.description}
                        </p>
                        <p className={styles.eventSeat}>
                          {event.seatAvailable}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </Layout>
    </>
  );
};
export const getSeverSideProps = async () => {
  const events = await getAllEvent();
  return {
    props: {
      events,
    },
  };
};
export default ShowEvents;
