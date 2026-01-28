import React, { createContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  userId: null,
  userName: '',
  userEmail: '',
  userToken: null,
  tokenExpirationTime: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        userId: action.payload.userId,
        userName: action.payload.userName,
        userEmail: action.payload.userEmail,
        userToken: action.payload.userToken,
        tokenExpirationTime: action.payload.tokenExpirationTime,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        userId: null,
        userName: '',
        userEmail: '',
        userToken: null,
        tokenExpirationTime: 0,
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const localData = localStorage.getItem('appState');
    return localData ? JSON.parse(localData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
