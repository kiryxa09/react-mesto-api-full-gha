import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import picSuccessPath from "../images/Success.svg";
import picRejectPath from "../images/Reject.svg";

const InfoTooltip = (props) => {
  const appContext = useContext(AppContext);
  return (
    <div
      className={`popup popup_block_infoTooltip ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className={`popup__container popup__container_infoTooltip`}>
        <button
          type="button"
          className={`popup__button popup__button-close popup__button-close_block_infoTooltip`}
          onClick={props.onClose}
        />
        <img
          className="popup__pic"
          src={appContext.tooltipInfo ? picSuccessPath : picRejectPath}
          alt={
            appContext.tooltipInfo
              ? "Успешно зарегистрировались"
              : "Возникла ошибка"
          }
        />
        <h2 className="popup__title popup__title_infoTooltip">
          {appContext.tooltipInfo
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </h2>
      </div>
      <div className="popup__overlay" />
    </div>
  );
};

export default InfoTooltip;
