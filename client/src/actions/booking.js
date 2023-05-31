import apiEndpoint from '../apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/booking`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${Cookies.get('token' || 'jwt')}`,
  },
});
export const vnPayBooking = async (
  selectedSeats,
  total,
  user,
  eventId,
  ticketPrice
) => {
  const res = await Axios.post('/create_payment_url', {
    selectedSeats,
    total,
    user,
    eventId,
    ticketPrice,
  });
  return res.data;
};

export const vnPayReturn = async () => {
  const res = await Axios.get(`/vnpay_return${window.location.search}`);
  return res.data;
};

export const momoPayment = async (selectedSeats, total) => {
  const res = await Axios.post('/momo_payment_url', { selectedSeats, total });
  return res.data;
};

export const momoRedirect = async () => {
  const res = await Axios.get(`/momo_return${window.location.search}`);
  return res.data;
};
