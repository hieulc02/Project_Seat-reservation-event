import React from 'react';
import styles from '../styles/loading.module.scss';
const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingPointContainer}>
        <div className={styles.loadingPoint}></div>
        <div className={styles.loadingPoint}></div>
        <div className={styles.loadingPoint}></div>
      </div>
    </div>
  );
};

export default Loading;
