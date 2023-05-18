import axios from 'axios';
import cookie from 'js-cookie';
import apiEndpoint from '../apiConfig';
export const Axios = axios.create({
  baseURL: `${apiEndpoint}/api/users`,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${cookie.get('token')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getUser = async () => {
  const res = await Axios.get('/me');
  return res.data.doc;
};

export const isAuth = async () => {
  try {
    const user = await getUser();
    if (user.role === 'admin') return true;
    return false;
  } catch (e) {
    console.log(e);
    return;
  }
};
