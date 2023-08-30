function ImagePopup(props) {
  return (
    <div
      className={`popup popup_block_image ${props.card ? "popup_opened" : ""}`}
    >
      <div className="popup__image-container">
        <button
          type="button"
          className="popup__button popup__button-close popup__button-close_block_image"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__image"
          src={props.card ? props.card.link : ""}
          alt={props.card ? props.card.name : ""}
        />
        <p className="popup__image-about">
          {props.card ? props.card.name : ""}
        </p>
      </div>
      <div className="popup__overlay popup__overlay_popup-image"></div>
    </div>
  );
}

export default ImagePopup;
