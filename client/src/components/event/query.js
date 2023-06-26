import React, { useState } from 'react';
import { getSuggestionEvent } from '../../actions/event';
import styles from '../../styles/query.module.scss';
import { FaSearch } from 'react-icons/fa';
import moment from 'moment';
import Link from 'next/link';

const QueryEvent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState([]);

  const handleInputChange = async (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (value.trim() === '') {
      setQuery([]);
    } else {
      try {
        const res = await getSuggestionEvent(value);
        setQuery(res);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.icon}>
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
        />

        {query.length > 0 && (
          <ul>
            {query.map((q) => (
              <li key={q.name}>
                <Link href={`/event/${q.slug}`}>
                  <div className={styles.box}>
                    <div className={styles.label}>{q.name}</div>
                    <div className={styles.content}>
                      <div>{q.venue}</div>
                      <div>{moment(q.dateStart).format('DD/MM/YYYY')}</div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default QueryEvent;
