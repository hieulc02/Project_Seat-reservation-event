import apiEndpoint from '../apiConfig';
import axios from 'axios';
import Cookies from 'js-cookie';

export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/events`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${Cookies.get('token' || 'jwt')}`,
  },
});
export const createEvent = async (dataForm) => {
  const res = await Axios.post('/', dataForm);
  return res.data;
};

export const getAllEvent = async (query = {}) => {
  const { price = 'AllPrice', venue = 'AllVenue' } = query;
  const sign = price === 'Charge' ? 'gt' : price === 'Free' ? 'lte' : 'gte';

  if (price === 'AllPrice' && venue === 'AllVenue') {
    query = null;
  }
  const queryParams = new URLSearchParams();
  if (query) {
    queryParams.set(`ticketPrice[${sign}]`, '0');
    venue !== 'AllVenue' && queryParams.set('venue', encodeURIComponent(venue));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `?${queryString}` : '';

  const res = await Axios.get(url);
  return res.data.doc;
};

export const getEvent = async (slug) => {
  const res = await Axios.get(`/${slug}`);
  // console.log(res);
  return res.data;
};

export const getAllEventsPending = async () => {
  const res = await Axios.get('/pending');
  return res.data;
};

export const updateEventStatus = async (id, status) => {
  const res = await Axios.patch(`/status/${id}`, { status });
  return res.data;
};
export const deleteEvent = async (id, userId) => {
  const res = await Axios.delete(`/${id}`, {
    headers: { 'X-User-Id': userId },
  });
  return res.data;
};

export const updateEvent = async (id, updatedEvent) => {
  const res = await Axios.patch(`/${id}`, updatedEvent);
  return res.data;
};

export const getEventUser = async (username) => {
  const res = await Axios.get(`/user/${username}`);
  return res.data;
};

export const getSuggestionEvent = async (query) => {
  const res = await Axios.get(`/suggestion?q=${query}`);
  return res.data;
};
