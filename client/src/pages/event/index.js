import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllEvent } from '../../actions/event';
import Layout from '../../components/layout';
import styles from '../../styles/event.module.scss';
import Loading from '../../components/loading';
import React from 'react';
import moment from 'moment';
import io from 'socket.io-client';
import apiEndpoint from '../../config/apiConfig';
import { checkAuthentication } from '../../auth';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import Footer from '../../components/footer';
const ShowEvents = ({ events }) => {
  const socket = useRef(null);
  const [data, setData] = useState(events);
  const [filter, setFilter] = useState({});
  const venueOptions = ['AllVenue', 'HCMC', 'HaNoi', 'Others'];
  const priceOptions = ['AllPrice', 'Free', 'Charge'];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getAllEvent();
        setData(docs);
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
  const handleOptionChange = (name) => async (e) => {
    let selectedOption = e.target.value;
    const updatedFilter = { ...filter, [name]: selectedOption };
    setFilter(updatedFilter);
    try {
      const filterEvent = await getAllEvent(updatedFilter);
      setData(filterEvent);
    } catch (e) {
      console.log(e);
    }
  };
  const isFull = data?.every((event) => event.seatAvailable === 0);

  return (
    <>
      <Layout>
        {!data && <Loading />}
        <div className={styles.headerCardItem}>Events</div>
        <div className={styles.optionContainer}>
          <div className={styles.optionWrapper}>
            <div className={styles.option}>
              <FaMapMarkerAlt />
              <select
                id="option-venue"
                value={filter?.venue}
                className={styles.select}
                onChange={handleOptionChange('venue')}
              >
                {venueOptions.map((e, i) => (
                  <option value={e} key={i}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.option}>
              <FaDollarSign />
              <select
                id="option-price"
                value={filter?.price}
                className={styles.select}
                onChange={handleOptionChange('price')}
              >
                {priceOptions.map((e, i) => (
                  <option value={e} key={i}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
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
                    (event.isApproved || event?.tempStatus === 'approved') && (
                      <div key={event._id}>
                        <div className={styles.eventCard}>
                          <Link
                            href={`/event/${event.slug}`}
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
                                  borderRadius: '10px',
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
      <Footer />
    </>
  );
};
export const getServerSideProps = async ({ req }) => {
  try {
    const authenticationCheck = await checkAuthentication(req);
    if ('redirect' in authenticationCheck) {
      return authenticationCheck;
    }
    const events = await getAllEvent(12);
    return {
      props: {
        events,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
export default ShowEvents;
