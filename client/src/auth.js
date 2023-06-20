import axios from 'axios';
import apiEndpoint from './apiConfig';
export const checkAuthentication = async (req) => {
  let jwtString = null;
  const keyValuePairs = req.headers?.cookie?.split('; ');
  if (keyValuePairs) {
    for (const pair of keyValuePairs) {
      if (pair.startsWith('jwt=')) {
        jwtString = pair.substring(4);
        break;
      }
    }
  } else {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const res = await axios.get(`${apiEndpoint}/api/users/me`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwtString}` },
    });
    const user = res.data.doc;
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      user,
    };
  } catch (e) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
