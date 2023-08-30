import React from "react";
import PopupWithForm from "./PopupWithForm";
import { AppContext } from "../context/AppContext";

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();
  const appContext = React.useContext(AppContext);

  function handleSubmit(e) {
    e.preventDefault();

    appContext.isLoading = true;

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [props.isOpen]);

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="popup__input-avatar"
        name="avatar"
        className="popup__input popup__input-avatar"
        type="url"
        placeholder="Ссылка на аватар"
        required=""
        ref={avatarRef}
      />
      <span className="popup__input-error popup__input-avatar-error" />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
