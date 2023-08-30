import React from "react";
import PopupWithForm from "./PopupWithForm";
import { AppContext } from "../context/AppContext";
import { useForm } from "../hooks/useForm";

function AddPlacePopup(props) {
  const { values, handleChange, setValues } = useForm({});
  const appContext = React.useContext(AppContext);

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    appContext.setLoading(true);

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onAddCard(values.title, values.image);
  }

  React.useEffect(() => {
    setValues("");
  }, [props.isOpen]);

  return (
    <PopupWithForm
      title="Новое место"
      name="elements"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="popup__input-card-title"
        name="title"
        className="popup__input popup__input_value_title"
        type="text"
        placeholder="Название"
        minLength={2}
        maxLength={30}
        required=""
        onChange={handleChange}
        value={values.title ?? ""}
      />
      <span className="popup__input-error popup__input-card-title-error" />
      <input
        id="popup__input-card-link"
        name="image"
        className="popup__input popup__input_value_link"
        type="url"
        placeholder="Ссылка на картинку"
        required=""
        onChange={handleChange}
        value={values.image ?? ""}
      />
      <span className="popup__input-error popup__input-card-link-error" />
    </PopupWithForm>
  );
}

export default AddPlacePopup;
