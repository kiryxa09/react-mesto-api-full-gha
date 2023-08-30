import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import * as auth from "../utills/auth";
import { AppContext } from "../context/AppContext";

const Login = (props) => {
  const { values, handleChange, setValues } = useForm({});
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    appContext.setEmail(values.email);

    if (!values.email || !values.password) {
      return;
    }

    auth
      .authorize({
        password: values.password,
        email: values.email,
      })
      .then((data) => {
        if (data.token) {
          setValues("");
          appContext.setLoggedIn(true);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth">
      <p className="auth__title">Вход</p>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          className="auth__input"
          required
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={values.email ?? ""}
          onChange={handleChange}
        />
        <input
          className="auth__input"
          required
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
          value={values.password ?? ""}
          onChange={handleChange}
        />
        <button type="submit" className="auth__button">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
