import React, { useState } from 'react';
import styles from '../styles/searchbar.module.scss';
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default SearchBar;
