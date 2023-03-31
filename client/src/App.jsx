import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import Messenger from './pages/messenger/Messenger';
import * as _ from 'lodash';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as userSlice from './redux/slices/userSlice';
import { getNotification } from './redux/slices/notificationSlice';
import { getConversations } from './redux/slices/messengerSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import Search from './pages/search/Search';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import './App.css'
import Group from './pages/group/Group';
import GroupDetail from './pages/groupDetail/GroupDetail';
function App() {
  const dispatch = useDispatch();
  const user = useSelector(userSlice.userSelector);
  const fetch = useSelector(userSlice.fetchSelector);

  useEffect(() => {
    if (_.get(user, 'username', null) !== null) {

      dispatch(userSlice.getFriends(user.username));

    }
    const getInformation = async () => {
      try {
        await dispatch(getNotification());
        await dispatch(getConversations());
      } catch (error) {

      }
    }
    getInformation();
  }, [user]);
  useEffect(() => {
    const getUser = async () => {

      try {
        await dispatch(userSlice.signInGoogle());
      } catch (error) {
      }
    };
    getUser();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Login />}
        </Route>
        <Route path="/home">
          {user ? <Home /> : <Login />}
        </Route>
        <Route path="/login">{user ? <Redirect to="/home" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/home" /> : <Register />}
        </Route>
        <Route path="/forgot-password">
          {user ? <Redirect to="/home" /> : <ForgotPassword />}
        </Route>
        <Route path="/messenger/:conversationId">
          {!user ? <Redirect to="/home" /> : <Messenger />}
        </Route>
        <Route path="/profile/:username">
          {!user ? <Redirect to="/home" /> : <Profile />}
        </Route>
        <Route path="/groups/:groupId">

          {!user ? <Redirect to="/home" /> : <GroupDetail />}
        </Route>
        <Route exact path="/groups">

          {!user ? <Redirect to="/home" /> : <Group />}
        </Route>

        <Route path="/search/:searchText">

          {!user ? <Redirect to="/home" /> : <Search />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
