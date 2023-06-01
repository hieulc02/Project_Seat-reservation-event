import dynamic from 'next/dynamic';
import Layout from '../../components/layout';
//import AddEvent from '../../components/addEvent';
const AddEvent = dynamic(() => import('../../components/event/add'), {
  ssr: false,
});
function CreateEvent() {
  return (
    <Layout>
      <AddEvent />
    </Layout>
  );
}

export default CreateEvent;
