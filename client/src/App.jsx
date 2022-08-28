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
function App() {
  const dispatch = useDispatch();
  // let user =null;
  const user = useSelector(userSlice.userSelector);
  const fetch = useSelector(userSlice.fetchSelector);

  // console.log('fetch', fetch);
  // const user = {
  //   id: 1,
  //   profilePicture: 'assets/person/1.jpeg',
  //   username: 'Safak Kocaoglu',
  // };
  useEffect(() => {
    console.log(1);
    console.log(_.get(user, 'username', null));
    if (_.get(user, 'username', null) !== null)
      dispatch(userSlice.getFriends(user.username));
  }, [user]);
  useEffect(() => {
    const getUser = async () => {

      try {
        await dispatch(userSlice.signInGoogle());
      } catch (error) {
        console.log(error);
      }
    };
    console.log('login google');
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
