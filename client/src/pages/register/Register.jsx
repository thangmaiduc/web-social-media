import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from 'react-router-dom';
import userApi from '../../api/userApi';
import { ToastContainer } from 'react-toastify';
import { notify } from '../../utility/toast';

export default function Register() {
  const username = useRef();
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(passwordAgain.current.value, password.current.value);
    if (passwordAgain.current.value !== password.current.value) {
      notify("Passwords không giống nhau!");
    } else {
      const user = {
        username: username.current.value,
        fullName: fullName.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const res = await userApi.register(user);
        notify(res.message);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login">

      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social Media</h3>
          <span className="loginDesc">
            Kết nối bạn bè và thế giới quanh bạn qua Social Media.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Họ tên"
              required
              ref={fullName}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link
              to={"/login"}
              style={{ textDecoration: "none" }}
            >
              <button className="loginRegisterbtn">Log into Account</button>
            </Link>
            <ToastContainer />
          </form>
        </div>
      </div>
    </div>
  );
}