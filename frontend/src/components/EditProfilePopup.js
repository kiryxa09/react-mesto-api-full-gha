import React from "react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";
import { AppContext } from "../context/AppContext";
import { useForm } from "../hooks/useForm";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const appContext = React.useContext(AppContext);
  const { values, handleChange, setValues } = useForm({});

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    appContext.isLoading = true;

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser(values.name, values.description);
  }

  React.useEffect(() => {
    setValues({
      name: currentUser.name,
      description: currentUser.about,
    });
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="profile"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="popup__input-name-profile"
        name="name"
        className="popup__input popup__input_value_name"
        type="text"
        placeholder="Имя"
        minLength={2}
        maxLength={40}
        required=""
        onChange={handleChange}
        value={values.name ?? ""}
      />
      <span className="popup__input-error popup__input-name-profile-error" />
      <input
        id="popup__input-about-profile"
        name="description"
        className="popup__input popup__input_value_about"
        type="text"
        placeholder="О себе"
        minLength={2}
        maxLength={200}
        required=""
        onChange={handleChange}
        value={values.description ?? ""}
      />
      <span className="popup__input-error popup__input-about-profile-error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
