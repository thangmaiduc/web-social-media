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
import { useEffect } from 'react';
import { useState } from 'react';
import Search from './pages/search/Search';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import './App.css'
function App() {
  const dispatch = useDispatch();
  const user = useSelector(userSlice.userSelector);
  const fetch = useSelector(userSlice.fetchSelector);
  useEffect(() => {
    if (_.get(user, 'username', null) !== null)
      dispatch(userSlice.getFriends(user.username));
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
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/forgot-password">
          {user ? <Redirect to="/" /> : <ForgotPassword />}
        </Route>
        <Route path="/messenger">
          {!user ? <Redirect to="/" /> : <Messenger />}
        </Route>
        <Route path="/profile/:username">

          {!user ? <Redirect to="/" /> : <Profile />}
        </Route>
        <Route path="/search/:searchText">

          {!user ? <Redirect to="/" /> : <Search /> }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
