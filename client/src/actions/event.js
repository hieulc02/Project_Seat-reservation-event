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
export const createEvent = async (event) => {
  const res = await Axios.post('/', event);
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

export const deleteEvent = async (id) => {
  const res = await Axios.delete(`/${id}`);
  return res.data;
};

export const updateEvent = async (id, updatedEvent) => {
  const res = await Axios.patch(`/${id}`, updatedEvent);
  return res.data;
};
