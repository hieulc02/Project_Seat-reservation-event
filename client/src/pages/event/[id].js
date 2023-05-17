import { useState, useEffect } from 'react';
import { getEvent } from '../../actions/event';
import Layout from '../../components/layout';
import BookingSeat from '../../components/booking/bookingSeat';
import Loading from '../../components/loading';
const Event = ({ id }) => {
  const [event, setEvent] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEvent(id);
        const doc = res.data.doc;
        setEvent(doc);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [id]);
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
