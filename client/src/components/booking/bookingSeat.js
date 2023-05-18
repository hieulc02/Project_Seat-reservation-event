import React, { useState } from 'react';
import styles from '../../styles/seat.module.scss';
import BookingCheckout from './bookingCheckout';

const BookingSeat = ({ seatGrid, ticketPrice }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some((s) => s._id === seat._id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.hall}>
          {seatGrid.map((seatRow, indexRow) => (
            <div key={indexRow} className={styles.row}>
              {seatRow.map((seat, indexCol) => (
                <React.Fragment key={seat._id}>
                  {seat.isOccupied ? (
                    <div
                      style={{ background: 'rgb(65, 66, 70)' }}
                      className={styles.occupied}
                      key={`${indexRow}-${indexCol}`}
                    >
                      {seat.row} - {seat.col}
                    </div>
                  ) : (
                    <div
                      style={{
                        background: selectedSeats.some(
                          (s) => s._id === seat._id
                        )
                          ? 'rgb(120, 205, 4)'
                          : 'rgb(96, 93, 169)',
                      }}
                      className={styles.seat}
                      key={`${indexRow}-${indexCol}`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.row} - {seat.col}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.seatInfoContainer}>
          <div className={styles.seatInfo}>
            <div
              className={styles.seatLabel}
              style={{ background: 'rgb(96, 93, 169)' }}
            ></div>
            Available
          </div>
          <div className={styles.seatInfo}>
            <div
              className={styles.seatLabel}
              style={{ background: 'rgb(65, 66, 70)' }}
            ></div>
            Reserved
          </div>
          <div className={styles.seatInfo}>
            <div
              className={styles.seatLabel}
              style={{ background: 'rgb(120, 205, 4)' }}
            ></div>
            Selected
          </div>
        </div>
      </div>
      <BookingCheckout
        selectedSeats={selectedSeats}
        ticketPrice={ticketPrice}
      />
      {/* <div>{selectedSeats.length * ticketPrice} &#x20AB;</div> */}
    </>
  );
};

export default BookingSeat;
