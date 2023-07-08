import React, { useEffect, useState } from 'react';
import styles from '../../styles/reservation.module.scss';
import { getReservationByUser } from '../../actions/reservation';
import Layout from '../../components/layout';
import Loading from '../../components/loading';
import { checkAuthentication } from '../../auth';

const Reservation = ({ user }) => {
  const [userReservation, setUserReservation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReservationByUser(user?._id);
        if (!res) return;
        setUserReservation(res.userReservation);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(true);
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
                  <div className={styles.date}>{reservation?.date}</div>
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
  const authenticationCheck = await checkAuthentication(req);

  if ('redirect' in authenticationCheck) {
    return authenticationCheck;
  }
  return {
    props: {
      user: authenticationCheck.user,
    },
  };
};

export default Reservation;
