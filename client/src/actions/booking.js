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
export const vnPayBooking = async (selectedSeats, total, user, eventId) => {
  const res = await Axios.post('/create_payment_url', {
    selectedSeats,
    total,
    user,
    eventId,
  });
  return res.data;
};

export const vnPayReturn = async () => {
  const res = await Axios.post(`/vnpay_return${window.location.search}`);
  return res.data;
};
