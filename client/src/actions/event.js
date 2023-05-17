import apiEndpoint from '../apiConfig';
import axios from 'axios';
import { getToken } from './handleUser';

const API = `${apiEndpoint}/api/events`;
export const createEvent = async (event) => {
  const token = getToken();
  const res = await axios.post(API, event, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};

export const getAllEvent = async () => {
  const res = await axios.get(API);
  console.log(res.data.data.doc);
  return res.data;
};

export const getEvent = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  console.log(res.data.data.doc);
  return res.data;
};
