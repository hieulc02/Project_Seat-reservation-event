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

export const getAllEvent = async () => {
  const res = await Axios.get();

  return res.data.doc;
};

export const getEvent = async (id) => {
  const res = await Axios.get(`/${id}`);
  // console.log(res);
  return res.data.doc;
};

export const getAllEventsPending = async () => {
  const res = await Axios.get('/pending');
  return res.data;
};

export const updateEventStatus = async (id, status) => {
  const res = await Axios.put(`/${id}`, { status });
  return res.data;
};
export const deleteEvent = async (id) => {
  const res = await Axios.delete(`/${id}`);
  return res.data;
};

export const updateEvent = async (id, updatedEvent) => {
  const res = await Axios.patch(`/${id}`, updatedEvent);
  return res.data;
};
