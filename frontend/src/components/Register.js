import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { AppContext } from "../context/AppContext";
import * as auth from "../utills/auth";

const Register = (props) => {
  const { values, handleChange } = useForm({});
  const appContext = React.useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    auth
      .register({
        password: values.password,
        email: values.email,
      })
      .then((res) => {
        if (res.data) {
          appContext.setTooltipInfo(true);
          navigate("/sign-in", { replace: true });
          appContext.setRegistered(false);
        }
      })
      .catch((err) => console.log(err));
    appContext.setTooltipInfo(false);
    props.onRegister();
  };

  const handleLinkClick = () => {
    appContext.setRegistered(false);
  };

  return (
    <div className="auth">
      <p className="auth__title">Регистрация</p>
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
          Зарегистрироваться
        </button>
      </form>
      <p className="auth__sign-up">
        Уже зарегистрированы?
        <Link onClick={handleLinkClick} to="/sign-in" className="auth__link">
          {" "}
          Войти
        </Link>
      </p>
    </div>
  );
};

export default Register;
