import { useContext, useRef } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  userSelector,
  fetchSelector,
  signIn,

} from '../../redux/slices/userSlice';
import { useEffect } from 'react';
import userApi from '../../api/userApi';
import {ToastContainer, notify } from '../../utility/toast';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const email = useRef();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.forgotPassword({ email: email.current.value })
      console.log('res',res);
      notify(res.message);

    } catch (error) {

    }
  }
  return (
    <div className="login">
    <ToastContainer />
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social Media</h3>
          <span className="loginDesc">
            Kết nối bạn bè và thế giới quanh bạn qua Social Media.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleForgotPassword}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />

            <button className="loginButton" type="submit" >
              Gửi email
            </button>
            <Link
              to={"/login"}
              style={{ textDecoration: "none" }}
              className="loginRegisterButton"
            >
              <button className="loginRegisterbtn">Đăng nhập</button>
            </Link>
          </form>


        </div>
      </div>
    </div >
  );
}
