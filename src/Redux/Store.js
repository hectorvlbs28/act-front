import storage from 'redux-persist/lib/storage';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import toast from 'react-hot-toast';

import userReducer from './user.Slice';
import navigationReducer from './navigation.Slice';
import passwordsReducer from './passwords.Slice';
import { setApiLoading } from './navigation.Slice';
import { fetchPasswords, fetchPasswordById, fetchDeletePasswordById } from './passwords.Slice';

const listenerMiddleware = createListenerMiddleware();
const passwordThunks = [fetchPasswords, fetchPasswordById, fetchDeletePasswordById];

passwordThunks.forEach((thunk) => {
  listenerMiddleware.startListening({
    actionCreator: thunk.pending,
    effect: (_, { dispatch }) => {
      dispatch(setApiLoading({ status: true }));
    },
  });

  listenerMiddleware.startListening({
    actionCreator: thunk.fulfilled,
    effect: (_, { dispatch }) => {
      dispatch(setApiLoading({ status: false }));
    },
  });

  listenerMiddleware.startListening({
    actionCreator: thunk.rejected,
    effect: (action, { dispatch }) => {
      dispatch(setApiLoading({ status: false }));
      const message = action.payload || action.error?.message;
      if (message) toast.error(message);
    },
  });
});

const createPersistConfig = (key) => ({
  key,
  storage,
});

const persistedUserReducer = persistReducer(createPersistConfig('user'), userReducer);
const persistedPasswordsReducer = persistReducer(createPersistConfig('passwords'), passwordsReducer);

export const store = configureStore({
  reducer: {
    User: persistedUserReducer,
    Navigation: navigationReducer,
    Passwords: persistedPasswordsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
