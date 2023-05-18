import apiEndpoint from '../apiConfig';
import axios from 'axios';
import cookie from 'js-cookie';

export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/reservation`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${cookie.get('token')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
export const createReservation = async (reservation) => {
  const res = await Axios.post('/', reservation);
  console.log(res);
  return res.data;
};
