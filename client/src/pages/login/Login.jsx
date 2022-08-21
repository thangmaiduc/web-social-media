import { useContext, useRef } from 'react';
import './login.css';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  userSelector,
  fetchSelector,
  signIn,
  
} from '../../redux/slices/userSlice';
import { useEffect } from 'react';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const dispatch = useDispatch();

  let isFetching = useSelector(fetchSelector);
  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(
      signIn({
        email: email.current.value,
        password: password.current.value,
      })
    );
  };

  const google = () => {
    window.open("http://localhost:8080/api/auth/google", "_self");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social Media</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social Media.
          </span>
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
          <button className="loginButtonGoogle" onClick={google} disabled={isFetching}>
            {isFetching ? (
              <CircularProgress color="secondary" size="20px" />
            ) : (
              'Log In By Google'
            )}
          </button>
          <button className="loginRegisterButton">
            {isFetching ? (
              <CircularProgress color="secondary" size="20px" />
            ) : (
              'Create a New Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
