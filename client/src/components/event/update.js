import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllEvent, updateEvent, deleteEvent } from '../../actions/event';
import styles from '../../styles/event.module.scss';
import SearchBar from '../search';
import Router from 'next/router';
const UpdateEvent = () => {
  const venueOptions = ['HCMC', 'HaNoi', 'Others'];
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
  const handleAddClick = () => {
    Router.push('/event/add-event');
  };
  const handleWaitingList = () => {
    Router.push('/admin/waiting-list');
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
        <div className={styles.boxContainer}>
          <SearchBar onSearch={handleSearch} />
          <div onClick={handleAddClick} className={styles.box}>
            Add
          </div>
          <div onClick={handleWaitingList} className={styles.box}>
            Waiting list
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Venue</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Price</th>
              <th>Seat</th>
              <th>Row</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>
            {filterEvent?.map((e, i) =>
              editMode && editEventId === e?._id ? (
                <tr key={i}>
                  <td>{e.isApproved ? 'Approved' : 'Pending'}</td>
                  <td>
                    <img
                      src={e.image}
                      alt="event-picture"
                      style={{ width: '5rem' }}
                    />
                  </td>
                  <td>
                    <textarea
                      type="text"
                      value={updatedEvent?.name}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          name: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      type="text"
                      value={updatedEvent?.description}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={venueOptions[0]}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          venue: e.target.value,
                        })
                      }
                    >
                      {venueOptions.map((e, i) => (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={updatedEvent?.dateStart}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          dateStart: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={updatedEvent?.dateEnd}
                      onChange={(e) =>
                        setUpdatedEvent({
                          ...updatedEvent,
                          dateEnd: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
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
                  </td>
                  <td>{e.seatAvailable}</td>
                  <td>{e.row}</td>
                  <td>{e.col}</td>
                  <td>
                    <div className={styles.button}>
                      <button
                        className={styles.update}
                        onClick={() => handleUpdateCLick(e._id, updatedEvent)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={i}>
                  <td>{e.isApproved ? 'Approved' : 'Pending'}</td>
                  <td>
                    <img
                      src={e.image}
                      alt="event-picture"
                      style={{ width: '5rem' }}
                    />
                  </td>
                  <td>{e.name}</td>
                  <td>{e.description}</td>
                  <td>{e.venue}</td>
                  <td>{e.dateStart}</td>
                  <td>{e.dateEnd}</td>
                  <td>{e.ticketPrice}</td>
                  <td>{e.seatAvailable}</td>
                  <td>{e.row}</td>
                  <td>{e.col}</td>
                  <td>
                    <div className={styles.button}>
                      <button
                        className={styles.update}
                        onClick={() => handleEditClick(e._id)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => handleDeleteClick(e._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UpdateEvent;
