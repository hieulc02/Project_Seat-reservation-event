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
        let d = [];
        docs.forEach((doc) => {
          d.push({ ...doc });
        });
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
      {!data && <Loading />}
      <Layout>
        {data?.length === 0 && (
          <div className={styles.noEvent}>
            <h1> No event today </h1>
          </div>
        )}
        <div className={styles.container}>
          {isFull && (
            <div className={styles.isFull}>
              <h1>Sorry, all shows is now full!</h1>
            </div>
          )}
          {data?.map((event, i) => (
            <React.Fragment key={i}>
              {event.seatAvailable > 0 && (
                <div key={event._id}>
                  <Link
                    href={`/event/${event._id}`}
                    className={styles.eventLink}
                  >
                    <div className={styles.eventCard}>
                      <p className={styles.eventName}>{event.name}</p>
                      <p className={styles.eventDescription}>
                        {event.description}
                      </p>
                      <p className={styles.eventSeat}>{event.seatAvailable}</p>
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
