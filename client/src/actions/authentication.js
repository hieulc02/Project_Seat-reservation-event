import axios from 'axios';
import apiEndpoint from '../apiConfig';
import Cookies from 'js-cookie';
import Router from 'next/router';
export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/users`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
export const login = async (email, password) => {
  const res = await Axios.post(`/login`, { email, password });
  setToken(res.data?.token);
  return res.data;
};

export const signup = async (user) => {
  const res = await Axios.post('/signup', user);
  setToken(res.data?.token);
  return res.data;
};

export const logout = async () => {
  const res = await Axios.get('/logout');
  Cookies.remove('token');
  Router.push('/login');
  return res.data;
};

export const setToken = (token) => {
  Cookies.set('token', token, { secure: true, expires: 365 });
};
