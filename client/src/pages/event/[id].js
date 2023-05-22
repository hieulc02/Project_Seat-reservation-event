import React, { useState, useEffect, useRef } from 'react';
import { getEvent } from '../../actions/event';
import Layout from '../../components/layout';
import Loading from '../../components/loading';
import io from 'socket.io-client';
import styles from '../../styles/seat.module.scss';
import BookingCheckout from '../../components/booking/bookingCheckout';
import apiEndpoint from '../../apiConfig';

const Event = ({ id }) => {
  const socket = useRef(null);
  const eventRoom = `event/${id}`;
  const [tempSeat, setTempSeat] = useState({});
  const [isTempSeat, setIsTempSeat] = useState(false);
  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [setToRoom, setSetToRoom] = useState([]);

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats?.some((s) => s._id === seat._id);
    setTempSeat(seat);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id));
      setIsTempSeat(false);
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setIsTempSeat(true);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEvent(id);
        setEvent(res.doc);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const sendBookSeat = () => {
      socket.current?.emit('seat-book', {
        room: eventRoom,
        seatId: tempSeat?._id,
        state: isTempSeat,
      });
    };
    sendBookSeat();
  }, [id, tempSeat, isTempSeat, selectedSeats]);
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(apiEndpoint, { transports: ['websocket'] });
    }
    if (socket.current) {
      socket.current.emit('join-room', eventRoom);
      socket.current.on('seat-book', (params) => {
        const deserializedParams = params.map((param) => ({
          ...param,
          seatId: param.seatId.toString(),
        }));
        setSetToRoom(deserializedParams);
      });
      return () => {
        if (socket.current) {
          socket.current.emit('leave-room', eventRoom);
          socket.current.off('seat-book');
        }
      };
    }
  }, [id, event, setToRoom]);

  return (
    <Layout>
      {!event && <Loading />}
      {event && (
        <div className={styles.container}>
          <div className={styles.hall}>
            {event?.seats.map((seatRow, indexRow) => (
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
                        className={styles.seat}
                        style={{
                          background: selectedSeats?.some(
                            (s) => s._id === seat._id
                          )
                            ? 'rgb(120, 205, 4)'
                            : setToRoom.some((s) => s.seatId === seat._id)
                            ? 'red'
                            : 'rgb(96, 93, 169)',
                        }}
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
          <BookingCheckout
            selectedSeats={selectedSeats}
            ticketPrice={event?.ticketPrice}
          />
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = async ({ params: { id } }) => {
  return {
    props: {
      id,
    },
  };
};

export default Event;
