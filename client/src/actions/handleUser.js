export const isBrowser = () => typeof window !== 'undefined';
export const getUser = () =>
  isBrowser() && window.localStorage.getItem('user')
    ? JSON.parse(window.localStorage.getItem('user'))
    : {};
export const getToken = () =>
  isBrowser() && window.localStorage.getItem('token')
    ? window.localStorage.getItem('token')
    : {};
export const setUser = (user) => {
  return window.localStorage.setItem('user', JSON.stringify(user));
};
export const setToken = (token) => {
  return window.localStorage.setItem('token', token);
};
export const isAuth = () => {
  if (getUser().role === 'admin') return true;
  return false;
};
// export const isLoggedIn = () => {
//   const user = getUser();
//   return !!user.name;
// };
