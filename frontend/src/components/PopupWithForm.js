import React from "react";
import { AppContext } from "../context/AppContext";

function PopupWithForm(props) {
  const appContext = React.useContext(AppContext);
  const buttonText = appContext.isLoading ? "Сохранение..." : "Сохранить";
  return (
    <div
      className={`popup popup_block_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className={`popup__container popup__container_${props.name}`}>
        <button
          type="button"
          className={`popup__button popup__button-close popup__button-close_block_${props.name}`}
          onClick={props.onClose}
        />
        <h2 className="popup__title">{props.title}</h2>
        <form
          name={`popup__form_${props.name}`}
          className={`popup__form popup__form_block_${props.name}`}
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button
            type="submit"
            className={`popup__button popup__button-confirm popup__button-confirm_${props.name}`}
          >
            {buttonText}
          </button>
        </form>
      </div>
      <div className="popup__overlay" />
    </div>
  );
}

export default PopupWithForm;
