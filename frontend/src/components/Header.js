import logoPath from "../images/logo.svg";
import { AppContext } from "../context/AppContext";
import React from "react";
import { Link } from "react-router-dom";
import * as auth from "../utills/auth";

function Header() {
  const appContext = React.useContext(AppContext);

  const handleLinkClick = () => {
    appContext.loggedIn
      ? appContext.setLoggedIn(false)
      : appContext.registered
      ? appContext.setRegistered(false)
      : appContext.setRegistered(true);
  };

  const exitMain = () => {
    appContext.setLoggedIn(false);
    auth.signOut();
  };

  return (
    <header className="header">
      <img className="header__logo" src={logoPath} alt="лого" />
      {appContext.loggedIn ? (
        <p className="header__email">
          {appContext.email}
          <Link to="/sign-in" className="header__link" onClick={exitMain}>
            Выйти
          </Link>
        </p>
      ) : (
        <Link
          onClick={handleLinkClick}
          to={appContext.registered ? "/sign-in" : "/sign-up"}
          className="header__link"
        >
          {appContext.registered ? "Войти" : "Регистрация"}
        </Link>
      )}
    </header>
  );
}

export default Header;
