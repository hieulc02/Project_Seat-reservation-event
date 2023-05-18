import React, { useState } from 'react';
import { isAuth } from '../actions/handleUser';
import { createEvent } from '../actions/event';
import Router from 'next/router';
import styles from '../styles/event.module.scss';
import { toast } from 'react-toastify';

const AddEvent = () => {
  const [event, setEvent] = useState({
    name: '',
    description: '',
    row: '',
    col: '',
    ticketPrice: '',
  });
  //  const [errors, setErrors] = useState('');
  const { name, description, row, col, ticketPrice } = event;
  const handleChange = (name) => {
    return (e) => {
      setEvent({ ...event, [name]: e.target.value });
    };
  };
  const handleSubmit = async () => {
    try {
      const e = await createEvent(event);
      toast.success(e.status);
      if (!e) return;
      Router.push(`/`);
    } catch (e) {
      toast.error(e.response.data.error);
    }
  };
  if (!isAuth()) {
    return (
      <div>
        <h1>Access denied</h1>
      </div>
    );
  }
  return (
    <>
      {isAuth() && (
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.main}>
              <label htmlFor="name" className={styles.label}>
                Event Name
              </label>
              <input
                type="text"
                id="name"
                className={styles.input}
                value={name}
                onChange={handleChange('name')}
                placeholder="Name"
                required
                minLength="5"
              />
            </div>
            <div>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <input
                type="text"
                id="description"
                className={styles.input}
                value={description}
                onChange={handleChange('description')}
                placeholder="Description"
                required
                minLength="5"
              />
            </div>
            <div>
              <label htmlFor="ticketPrice" className={styles.label}>
                Ticket Price
              </label>
              <input
                type="text"
                id="ticketPrice"
                className={styles.input}
                value={ticketPrice}
                onChange={handleChange('ticketPrice')}
                placeholder="Ticket price"
              />
            </div>
            <div>
              <label htmlFor="row" className={styles.label}>
                Row Seats
              </label>
              <input
                type="text"
                id="row"
                className={styles.input}
                value={row}
                onChange={handleChange('row')}
                placeholder="Row Seats"
              />
            </div>
            <div>
              <label htmlFor="col" className={styles.label}>
                Column Seats
              </label>
              <input
                type="text"
                id="col"
                className={styles.input}
                value={col}
                onChange={handleChange('col')}
                placeholder="Column Seats"
              />
            </div>
            <div className={styles.cont_button}>
              <button onClick={handleSubmit} className={styles.button}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEvent;
