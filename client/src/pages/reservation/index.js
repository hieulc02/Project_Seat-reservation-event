import axios from 'axios';
import moment from 'moment';
import apiEndpoint from '../../apiConfig';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/reservation.module.scss';
import { getReservationByUser } from '../../actions/reservation';
import Layout from '../../components/layout';
import Loading from '../../components/loading';

const Reservation = ({ user }) => {
  const [userReservation, setUserReservation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReservationByUser(user?._id);
        if (!res) return;
        const data = res.userReservation;
        console.log(data);
        const doc = data.map((res) => res);
        setUserReservation(doc);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);
  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout>
      {userReservation?.length === 0 && (
        <div className={styles.noReservation}>No reservations found!</div>
      )}
      <div className={styles.container}>
        {userReservation.map((reservation, i) => (
          <React.Fragment key={i}>
            <div className={styles.boxContainer} key={reservation._id}>
              <div className={styles.box}>
                <div className={styles.dateContainer}>
                  Date:
                  <div className={styles.date}>
                    {moment(reservation?.date).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className={styles.eventContainer}>
                  Event:
                  <div className={styles.event}>
                    {reservation?.eventId?.name}
                  </div>
                </div>
                <div className={styles.descriptionContainer}>
                  Brief:
                  <div className={styles.description}>
                    {reservation?.eventId?.description}
                  </div>
                </div>
                <div className={styles.seatContainer}>
                  Seat:
                  <div className={styles.seat}>
                    {reservation?.seats?.map((s, i) =>
                      i === 0 ? `${s.row}-${s.col}` : `, ${s.row}-${s.col}`
                    )}
                  </div>
                </div>
                <div className={styles.amount}>
                  Total:
                  <div className={styles.total}> {reservation?.total}</div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({ req }) => {
  let jwtString = null;
  const keyValuePairs = req.headers?.cookie?.split('; ');
  if (keyValuePairs) {
    for (const pair of keyValuePairs) {
      if (pair.startsWith('jwt=')) {
        jwtString = pair.substring(4);
        break;
      }
    }
  }
  const res = await axios.get(`${apiEndpoint}/api/users/me`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${jwtString}` },
  });
  const user = res.data.doc;
  return {
    props: {
      user,
    },
  };
};

export default Reservation;
