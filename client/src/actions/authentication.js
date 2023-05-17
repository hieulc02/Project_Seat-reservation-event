import axios from 'axios';
import apiEndpoint from '../apiConfig';
import { setUser, setToken } from './handleUser';
//import { cookies } from 'next/headers';

export const login = async (email, password) => {
  const user = { email, password };
  const res = await axios.post(`${apiEndpoint}/api/users/login`, user, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  console.log(res);
  if (res.status === 200) {
    const { user, token } = res.data;
    user && setUser(user);
    setToken(token);
  }
  return res.data;
};

export const signup = async (user) => {
  const res = await axios.post(`${apiEndpoint}/api/users/signup`, user, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios.get(`${apiEndpoint}/api/users/logout`);
  return res.data;
};
