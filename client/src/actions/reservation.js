import apiEndpoint from '../apiConfig';
import axios from 'axios';
import { getToken } from './handleUser';

const API = `${apiEndpoint}/api/reservation`;
export const createReservation = async (reservation) => {
  const token = getToken();
  const res = await axios.post(API, reservation, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};
