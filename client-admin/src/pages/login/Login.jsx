import { useContext, useRef } from 'react';
import './login.css';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  userSelector,
  fetchSelector,
  signIn,
  errorSelector,
} from '../../redux/slices/userSlice';
import  { notify, ToastContainer } from '../../utility/toast';
export default function Login() {
  const email = useRef();
  const password = useRef();
  const dispatch = useDispatch();

  let isFetching = useSelector(fetchSelector);
  let isError = useSelector(errorSelector);
  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(
      signIn({
        email: email.current.value,
        password: password.current.value,
      })
    );
  };
  if(isError){
    notify('Đăng nhập thất bại')
  }

  return (

    <div className="login">
    {/* <ToastContainer /> */}
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Admin Social Media</h3>
          
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              // type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                'Log In'
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            
          </form>
        </div>
      </div>
    </div>
  );
}
