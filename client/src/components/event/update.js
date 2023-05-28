import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllEvent, updateEvent, deleteEvent } from '../../actions/event';
import styles from '../../styles/event.module.scss';
import SearchBar from '../searchBar';
const UpdateEvent = () => {
  const [editMode, setEditMode] = useState(false);
  const [event, setEvent] = useState([]);
  const [updatedEvent, setUpdatedEvent] = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getAllEvent();
        if (!res) return;
        setEvent(res);
      } catch (e) {
        console.log(e);
      }
    };
    fetchEvent();
  }, []);

  const handleUpdateCLick = async (id, updatedEvent) => {
    try {
      const res = await updateEvent(id, updatedEvent);
      if (!res) return;
      toast.success(res.status);
      setEditMode(false);
      setEvent((prevEvent) =>
        prevEvent.map((e) => (e._id === id ? updatedEvent : e))
      );
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data.error);
    }
  };
  const handleDeleteClick = async (id) => {
    try {
      await deleteEvent(id);
      setEvent((prevEvent) => prevEvent.filter((e) => e._id !== id));
      toast.success('Event successfully deleted');
    } catch (e) {
      console.log(e);
    }
  };
  const handleEditClick = (id) => {
    setEditEventId(id);
    setUpdatedEvent(event.find((e) => e._id === id));
    setEditMode(true);
  };
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const filterEvent = event.filter((e) => {
    const name = e.name.toLowerCase();
    const description = e.description.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || description.includes(search);
  });
  return (
    <>
      <div className={styles.updateContainer}>
        <SearchBar onSearch={handleSearch} />
        <div className={styles.header}>
          <div className={styles.name}>Name</div>
          <div className={styles.des}>Description</div>
          <div className={styles.price}>Price</div>
          <div className={styles.amount}>Seat</div>
          <div className={styles.row}>Row</div>
          <div className={styles.col}>Col</div>
        </div>
        <div className={styles.tableContainer}>
          {filterEvent?.map((e, i) => (
            <React.Fragment key={i}>
              <div className={styles.tableEvent} key={e._id}>
                <div className={styles.name}>
                  {editMode && editEventId === e?._id ? (
                    <input
                      type="text"
                      value={updatedEvent?.name}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    e.name
                  )}
                </div>
                <div className={styles.description}>
                  {editMode && editEventId === e?._id ? (
                    <input
                      type="text"
                      value={updatedEvent?.description}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    e.description
                  )}
                </div>

                <div className={styles.ticketPrice}>
                  {editMode && editEventId === e?._id ? (
                    <input
                      type="text"
                      value={updatedEvent?.ticketPrice}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          ticketPrice: e.target.value,
                        })
                      }
                    />
                  ) : (
                    e.ticketPrice
                  )}
                </div>
                <div className={styles.seat}>{e.seatAvailable}</div>
                <div className={styles.row}>{e.row}</div>
                <div className={styles.col}>{e.col}</div>
                {editMode && editEventId === e?._id ? (
                  <button
                    className={styles.update}
                    onClick={() => handleUpdateCLick(e._id, updatedEvent)}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className={styles.update}
                    onClick={() => handleEditClick(e._id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={styles.delete}
                  onClick={() => handleDeleteClick(e._id)}
                >
                  Delete
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpdateEvent;
