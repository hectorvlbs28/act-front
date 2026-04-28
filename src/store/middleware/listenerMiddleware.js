import { createListenerMiddleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import { setApiLoading } from "../navigation.slice";
import {
  fetchPasswords,
  fetchPasswordById,
  fetchDeletePasswordById,
} from "../../features/passwords/store/passwords.slice";

export const listenerMiddleware = createListenerMiddleware();

const trackedThunks = [
  fetchPasswords,
  fetchPasswordById,
  fetchDeletePasswordById,
];

trackedThunks.forEach((thunk) => {
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
