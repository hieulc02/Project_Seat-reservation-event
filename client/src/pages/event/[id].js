import { useState, useEffect } from 'react';
import { getEvent } from '../../actions/event';
import Layout from '../../components/layout';
import BookingSeat from '../../components/booking/bookingSeat';
import Loading from '../../components/loading';
//import { io } from 'socket.io-client';
import apiEndpoint from '../../apiConfig';
let socket;
const Event = ({ id }) => {
  const [event, setEvent] = useState(null);
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
  // useEffect(() => {
  //   socketInitial();
  // }, []);
  // const socketInitial = () => {
  //   socket = io(apiEndpoint);
  //   console.log(socket.id);
  //   //socket.emit('join-room', `/events/${id}`);
  // };
  if (!event) {
    return <Loading />;
  }
  return (
    <Layout>
      <BookingSeat seatGrid={event.seats} ticketPrice={event.ticketPrice} />
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
