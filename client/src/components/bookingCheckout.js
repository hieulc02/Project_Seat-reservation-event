import styles from '../styles/checkout.module.scss';
import React, { useEffect, useState } from 'react';
import { vnPayBooking } from '../actions/booking';
import { useRouter } from 'next/router';

const BookingCheckout = ({ selectedSeats, ticketPrice, user }) => {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    setTotal(selectedSeats.length);
    if (selectedSeats) {
      setEventId(selectedSeats[0]?.eventId);
    }
  }, [selectedSeats]);

  const handleClick = async () => {
    try {
      const res = await vnPayBooking(
        selectedSeats,
        total,
        user,
        eventId,
        ticketPrice
      );
      if (!res) {
        return;
      }
      router.replace(res.paymentUrl);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.ticket}>{selectedSeats?.length} Tickets</div>
        <div className={styles.price}>
          {selectedSeats?.length * ticketPrice} &#x20AB;
        </div>
        <div className={styles.seatContainer}>
          <>
            Seat:
            {selectedSeats?.map((s, i) => (
              <div className={styles.seat} key={i}>
                {s.row}-{s.col}
              </div>
            ))}
          </>
        </div>
        <div className={styles.checkout}>
          {selectedSeats?.length > 0 && (
            <button onClick={handleClick} className={styles.button}>
              Checkout by Vnpay
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingCheckout;
