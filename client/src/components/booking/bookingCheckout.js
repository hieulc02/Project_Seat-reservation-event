import styles from '../../styles/checkout.module.scss';
import React from 'react';
import { createReservation } from '../../actions/reservation';
import { getUser } from '../../actions/handleUser';
import { toast } from 'react-toastify';
import Router from 'next/router';

const BookingCheckout = ({ selectedSeats, ticketPrice }) => {
  const user = getUser();
  let event;
  if (selectedSeats) {
    event = selectedSeats[0]?.eventId;
  }
  // console.log(selectedSeats[0]);
  let total = selectedSeats.length;
  const handleClick = async () => {
    try {
      const res = await createReservation({
        selectedSeats,
        total,
        user,
        event,
      });
      if (!res) return;
      toast.success(res.status);
      Router.push(`/`);
    } catch (e) {
      console.log(e.response.data.error);
      toast.error(e.response.data.error);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.ticket}>{selectedSeats.length} Tickets</div>
        <div className={styles.price}>
          {selectedSeats.length * ticketPrice} &#x20AB;
        </div>
        <div className={styles.seatContainer}>
          <>
            Seat:
            {selectedSeats.map((s, i) => (
              <div className={styles.seat} key={i}>
                {s.row}-{s.col}
              </div>
            ))}
          </>
        </div>
        <div className={styles.checkout}>
          <button onClick={handleClick} className={styles.button}>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingCheckout;
