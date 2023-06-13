import styles from '../styles/checkout.module.scss';
import React, { useEffect, useState } from 'react';
import { momoPayment, vnPayPayment } from '../actions/payment';
import { useRouter } from 'next/router';

const BookingCheckout = ({ selectedSeats, ticketPrice, user, event }) => {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [eventId, setEventId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [amount, setAmount] = useState(selectedSeats?.length * ticketPrice);
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState(event.venueDetail);

  useEffect(() => {
    setTotal(selectedSeats.length);
    if (selectedSeats) {
      setEventId(selectedSeats[0]?.eventId);
    }
    setAmount(selectedSeats?.length * ticketPrice);
    setDate(`${event.dateStart} - ${event.dateEnd}`);
    setVenue(event.venue);
  }, [selectedSeats]);

  const handleClick = async () => {
    try {
      let res;
      if (selectedOption === 'vnPay') {
        res = await vnPayPayment(
          selectedSeats,
          total,
          user,
          eventId,
          date,
          venue,
          amount
        );
        router.replace(res?.paymentUrl);
      } else {
        res = await momoPayment(
          selectedSeats,
          total,
          user,
          eventId,
          date,
          venue,
          amount
        );
        router.replace(res?.payUrl);
        // console.log(res?.payUrl);
      }
      if (!res) {
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.name}>{event.name}</div>

        <div className={styles.ticket}>
          <div>Total: </div>
          <div className={styles.value}>{selectedSeats?.length}</div>
        </div>
        <div className={styles.price}>
          <div>Sum of damages: </div>
          <div className={styles.value}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(amount)}
          </div>
        </div>
        <div className={styles.seatContainer}>
          <div>Seat: </div>
          <div className={styles.value}>
            {selectedSeats?.map((s, i) => (
              <div className={styles.seat} key={i}>
                {s.row}-{s.col}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.box}>
            <input
              type="checkbox"
              id="checkbox"
              className={styles.checkbox}
              checked={selectedOption === 'vnPay'}
              onChange={() => {
                handleOptionChange('vnPay');
              }}
            />
            <label htmlFor="checkbox">Pay with VnPay</label>
          </div>
          <div className={styles.box}>
            <input
              type="checkbox"
              id="checkbox"
              className={styles.checkbox}
              checked={selectedOption === 'MoMo'}
              onChange={() => {
                handleOptionChange('MoMo');
              }}
            />
            <label htmlFor="checkbox">Pay with MoMo</label>
          </div>
        </div>
        <div className={styles.checkout}>
          {selectedSeats?.length > 0 && selectedOption && (
            <button onClick={handleClick} className={styles.button}>
              Place Order
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingCheckout;
