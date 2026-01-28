import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./user.Slice";
import navigationReducer from "./navigation.Slice";
import passwordsReducer from "./passwords.Slice";

const createPersistConfig = (key) => ({
  key,
  storage,
});

const persistedUserReducer = persistReducer(
  createPersistConfig("user"),
  userReducer
);
const persistedPasswordsReducer = persistReducer(
  createPersistConfig("passwords"),
  passwordsReducer
);

export const store = configureStore({
  reducer: {
    User: persistedUserReducer,
    Navigation: navigationReducer,
    Passwords: persistedPasswordsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
