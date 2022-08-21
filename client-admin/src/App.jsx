import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import User from './pages/user/User';
import Post from './pages/post/Post';
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
import EnhancedTable from "./pages/table/Table";
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
  return (
    <Router>
      <Switch>
        <Route exact path="/admin/dashboard">
          {user ? <Dashboard />: <Login />}
        </Route>
        <Route exact path="/">
          {user ? <Dashboard />: <Login />}
        </Route>
        <Route path="/login">{user ? <Redirect to="/admin/dashboard" /> : <Login />}</Route>

        <Route path="/admin/users">
          {user ? <User/> : <Login />}
          
        </Route>
        {/* <Route path="/admin/table">
          <EnhancedTable/>
        </Route> */}
        <Route path="/admin/posts">
        {user ? <Post/> : <Login />}
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;
