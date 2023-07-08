import apiEndpoint from '../config/apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/reservation`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${Cookies.get('token' || 'jwt')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
export const createReservation = async (reservation) => {
  const res = await Axios.post('/', reservation);
  return res.data;
};

export const getAllReservation = async () => {
  const res = await Axios.get('/');
  return res.data;
};

export const getReservationByUser = async (id) => {
  const res = await Axios.post(`/me`, { id });
  return res.data;
};
