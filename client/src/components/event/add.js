import React, { useState } from 'react';
import { createEvent } from '../../actions/event';
import styles from '../../styles/event.module.scss';
import { toast } from 'react-toastify';

const AddEvent = ({ user }) => {
  const [event, setEvent] = useState({
    name: '',
    description: '',
    venue: '',
    dateStart: '',
    dateEnd: '',
    row: '',
    col: '',
    ticketPrice: '',
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const {
    name,
    description,
    venue,
    dateStart,
    dateEnd,
    row,
    col,
    ticketPrice,
  } = event;
  const venueOptions = ['HCMC', 'HaNoi', 'Others'];

  const handleChange = (name) => {
    return (e) => {
      setEvent({ ...event, [name]: e.target.value });
    };
  };
  const handleSubmit = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('data', JSON.stringify(event));
    formData.append('user', JSON.stringify(user));
    try {
      const res = await createEvent(formData);
      toast.success(res.status);
      setSelectedImage(null);
      setPreviewSource('');
      setEvent({
        name: '',
        description: '',
        dateStart: '',
        dateEnd: '',
        row: '',
        col: '',
        ticketPrice: '',
        image: '',
      });
      document.getElementById('start').value = '';
      document.getElementById('end').value = '';
      document.getElementById('image').value = null;
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
      <div className={styles.addContainer}>
        <div className={styles.addWrapper}>
          <div className={styles.main}>
            <input
              type="file"
              id="image"
              className={styles.input}
              onChange={handleImageChange}
            />
            {previewSource && (
              <img
                src={previewSource}
                alt="event-picture"
                style={{ height: '15rem' }}
              />
            )}
          </div>
          <div className={styles.main}>
            <label htmlFor="name" className={styles.label}>
              Event Name:
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
          <div className={styles.main}>
            <label htmlFor="description" className={styles.label}>
              Description:
            </label>
            <textarea
              type="text"
              id="description"
              className={styles.descriptionText}
              value={description}
              onChange={handleChange('description')}
              placeholder="Description"
              required
              minLength="5"
            />
          </div>
          <div className={styles.main}>
            <label htmlFor="option-venue" className={styles.label}>
              Venue:{' '}
            </label>
            <select
              id="option-venue"
              value={venue}
              className={styles.input}
              onChange={handleChange('venue')}
            >
              {venueOptions.map((e, i) => (
                <option value={e} key={i}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.main}>
            <label htmlFor="startDate" className={styles.label}>
              Start date:
            </label>
            <input
              type="date"
              id="start"
              className={styles.input}
              value={dateStart}
              onChange={handleChange('dateStart')}
            />
          </div>
          <div className={styles.main}>
            <label htmlFor="endDate" className={styles.label}>
              End date:
            </label>
            <input
              type="date"
              id="end"
              className={styles.input}
              value={dateEnd}
              onChange={handleChange('dateEnd')}
            />
          </div>
          <div className={styles.main}>
            <label htmlFor="ticketPrice" className={styles.label}>
              Ticket Price:
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
          <div className={styles.main}>
            <label htmlFor="row" className={styles.label}>
              Row Seats:
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
          <div className={styles.main}>
            <label htmlFor="col" className={styles.label}>
              Column Seats:
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
