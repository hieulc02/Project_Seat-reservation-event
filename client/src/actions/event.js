import apiEndpoint from '../apiConfig';
import axios from 'axios';
import cookie from 'js-cookie';

export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/events`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${cookie.get('token')}`,
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
  return res.data;
};
