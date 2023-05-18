import axios from 'axios';
import apiEndpoint from '../apiConfig';
import cookie from 'js-cookie';
import Router from 'next/router';
import { isAuth } from './handleUser';
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
  const res = await axios.post('/signup', user);
  setToken(res.data?.token);
  return res.data;
};

export const logout = async () => {
  const res = await Axios.get('/logout');
  cookie.remove('token');
  Router.push('/login');
  return res.data;
};

const setToken = (token) => {
  cookie.set('token', token, { secure: true });
  isAuth() ? Router.push(`/admin`) : Router.push(`/`);
};
