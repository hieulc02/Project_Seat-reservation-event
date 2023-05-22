import axios from 'axios';
import Cookies from 'js-cookie';
import apiEndpoint from '../apiConfig';
import Router from 'next/router';
export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/users`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${Cookies.get('token' || 'jwt')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getUser = async () => {
  const res = await Axios.get('/me');
  return res.data.doc;
};

export const isAuth = async () => {
  const user = await getUser();
  //console.log(user);
  if (user?.role === 'admin') {
    return true;
  } else {
    return false;
  }
};
