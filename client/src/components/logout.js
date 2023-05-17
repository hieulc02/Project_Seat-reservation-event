import { logout } from '../actions/authentication';
import Router from 'next/router';
import { toast } from 'react-toastify';

const ButtonLogout = () => {
  const handleClick = async () => {
    try {
      const doc = await logout();
      if (!doc) return;
      toast.success(doc.status);
      localStorage.clear();
      Router.push(`/login`);
    } catch (e) {
      console.log(e);
    }
  };
  return <button onClick={handleClick}>Log out</button>;
};

export default ButtonLogout;
