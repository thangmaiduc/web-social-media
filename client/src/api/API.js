const baseURL = process.env.REACT_APP_API_URL;
const api = {
  GET_POST_TIMELINE: baseURL + '/posts/timeline/',
  GET_POST_PROFILE: baseURL + '/posts/profile/',
  GET_FRIENDS: baseURL + '/users/friends/',
  GET_USER: baseURL + '/users/',
  GET_ME: baseURL + '/users/me',
};
export default api;