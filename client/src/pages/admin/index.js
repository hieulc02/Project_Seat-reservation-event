import React, { useState } from 'react';
import Layout from '../../components/layout';
import UpdateEvent from '../../components/event/update';

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState('event');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Layout>
      <div onClick={() => handleTabClick('event')}>Event</div>
      {selectedTab === 'event' && <UpdateEvent />}
    </Layout>
  );
};

export default Admin;
