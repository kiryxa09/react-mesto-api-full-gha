import logoPath from "../images/logo.svg";
import { AppContext } from "../context/AppContext";
import React from "react";
import { Link } from "react-router-dom";
import menuButtonPath from "../images/menuButton.svg";
import closeMenuButtonPath from "../images/closeMenuButton.svg";

function Header() {
  const appContext = React.useContext(AppContext);
  const [menuState, setMenuState] = React.useState(true);

  const handleLinkClick = () => {
    appContext.loggedIn
      ? appContext.setLoggedIn(false)
      : appContext.registered
      ? appContext.setRegistered(false)
      : appContext.setRegistered(true);
  };

  const exitMain = () => {
    appContext.setLoggedIn(false);
    localStorage.removeItem("jwt");
  };

  const handleMenuClick = () => {
    setMenuState(!menuState);
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
