import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  apiLoading: false,
};

export const navigationSlice = createSlice({
  name: "Navigation",
  initialState,
  reducers: {
    setApiLoading: (state, action) => {
      const { status } = action.payload;
      state.apiLoading = status;
    },
  },
});

export const { setApiLoading } = navigationSlice.actions;

export const selectApiLoading = (state) => state.Navigation.apiLoading;

export default navigationSlice.reducer;
