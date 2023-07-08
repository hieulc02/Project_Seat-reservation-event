import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import styles from '../../styles/featuredEvent.module.scss';

const Event = ({ events }) => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {events &&
            events.map((event, i) => (
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
                            {moment(event.dateStart).format('DD/MM/YYYY')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
};

export default Event;
