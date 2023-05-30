import React, { useState } from 'react';
import { createEvent, imageToCloudinary } from '../../actions/event';
import Router from 'next/router';
import styles from '../../styles/event.module.scss';
import { toast } from 'react-toastify';

const AddEvent = () => {
  const [event, setEvent] = useState({
    name: '',
    description: '',
    row: '',
    col: '',
    ticketPrice: '',
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const { name, description, row, col, ticketPrice } = event;

  const handleChange = (name) => {
    return (e) => {
      setEvent({ ...event, [name]: e.target.value });
    };
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('data', JSON.stringify(event));
      const res = await createEvent(formData);
      toast.success(res.status);
      setSelectedImage(null);
      setPreviewSource('');
      setEvent({
        name: '',
        description: '',
        row: '',
        col: '',
        ticketPrice: '',
        image: '',
      });
    } catch (e) {
      console.log(e.response);
      //  toast.error(e.response);
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    const encodedSource = await toBase64(file);
    setPreviewSource(encodedSource);
  };
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div>
            <input type="file" onChange={handleImageChange} />
            {previewSource && (
              <img
                src={previewSource}
                alt="event-picture"
                style={{ height: '20rem' }}
              />
            )}
          </div>
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
    </>
  );
};

export default AddEvent;
