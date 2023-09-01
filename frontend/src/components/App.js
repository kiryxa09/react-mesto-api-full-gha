import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { AppContext } from "../context/AppContext";
import { api } from "../utills/api";
import React from "react";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRouteElement from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utills/auth";

function App() {
  const [isEditProfilePopupOpen, openProfilePopup] = React.useState(false);
  const [isAddPlacePopupOpen, openPlacePopup] = React.useState(false);
  const [isEditAvatarPopupOpen, openAvatarPopup] = React.useState(false);
  const [isInfoTooltipOpen, openInfoTooltip] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [tooltipInfo, setTooltipInfo] = React.useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === "/sign-up") {
      setRegistered(true);
    }
  });

  React.useEffect(() => {
    if(loggedIn) {
      Promise.all([                
        api.getProfileInfo(), 
        api.getInitialCards() 
      ]) 
      .then(([info, cards])=>{    
        setUser(info);
        setCards(cards);    
      }) 
      .catch((err)=>{              
      console.log(err);
      })
    } 
  }, [loggedIn]);

  

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setLoggedIn(true);
          setEmail(res.data.email);
          navigate("/", { replace: true });
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  };

  function handleEditProfileClick() {
    openProfilePopup(true);
  }

  function handleAddPlaceClick() {
    openPlacePopup(true);
  }

  function handleEditAvatarClick() {
    openAvatarPopup(true);
  }

  function handleRegistration() {
    openInfoTooltip(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    openProfilePopup(false);

    openPlacePopup(false);

    openAvatarPopup(false);

    openInfoTooltip(false);

    setSelectedCard(null);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => (c._id !== card._id ? c : null))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(name, about) {
    api
      .patchProfileInfo(name, about)
      .then((info) => {
        setUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchAvatar(avatar)
      .then((info) => {
        setUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleAddPlaceSubmit(title, image) {
    api
      .addNewCard(title, image)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isInfoTooltipOpen ||
    selectedCard;

  React.useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  return (
    <AppContext.Provider
      value={{
        setLoading,
        isLoading,
        setLoggedIn,
        loggedIn,
        setRegistered,
        registered,
        setEmail,
        email,
        setTooltipInfo,
        tooltipInfo,
      }}
    >
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header email={email} />
          <Routes>
            <Route
              path="/"
              element={ 
                <ProtectedRouteElement
                  element={Main}
                  cards={cards}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              }
            />
            <Route path="/sign-in" element={<Login />} />
            <Route
              path="/sign-up"
              element={<Register onRegister={handleRegistration} />}
            />
            <Route path="*" element={<Navigate to="sign-in" replace/>} />
          </Routes>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddPlaceSubmit}
          />
          <PopupWithForm title="Вы уверены?" name="delete" />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            title="Вы успешно зарегистрировались!"
          />
          {loggedIn && <Footer />}
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
