let host = window.location.host + '/api';
if (process.env.REACT_APP_API_URL) host = process.env.REACT_APP_API_URL;
const api = {
  GET_POST_TIMELINE: '/posts/timeline/',
  GET_POST_PROFILE: '/posts/profile/',
  CREATE_POST: '/posts/',
  QUERY_POSTS: '/posts/query/',

  GET_POSTS_GROUP: '/posts/group/',

  CREATE_COMMENT: '/comments/',
  DELETE_COMMENT: '/comments/',
  EDIT_COMMENT: '/comments/',
  GET_COMMENTS: '/comments/posts/',

  GET_FRIENDS: '/users/friends/',
  GET_USER: '/users/',
  CHANGE_PASSWORD: '/users/change-password/',
  QUERY_USERS: '/users/query/',
  GET_ME: '/users/me',

  UPLOAD: '/cloudinary-upload',

  GET_CONVERSATIONS: '/conversations/',
  VIEW_CONVERSATIONS: '/conversations/view',
  ADD_MEMBER: '/conversations/members/',

  GET_MESSAGES: '/messages/',

  CREATE_MESSAGE: '/messages/',

  GROUP: '/groups/',
  QUERY_GROUP: '/groups/query',
  SUGGEST_GROUP: '/groups/suggested',
  ADD_MEMBER_GROUP: '/groups/members/',
  GET_MEMBER_GROUP: '/groups/members/get',
  APPROVE_MEMBER_GROUP: '/groups/members/approve',
  REJECT_MEMBER_GROUP: '/groups/members/reject',
  BAN_MEMBER_GROUP: '/groups/members/ban',
  DELETE_MEMBER_GROUP: '/groups/members/delete',
};
export default api;
