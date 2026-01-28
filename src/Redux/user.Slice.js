import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  userName: "",
  user_id: "",
  userToken: "",
  tokenExpirationTime: 0,
  isLogged: false,
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setLoginUser: (state, action) => {
      const { name, userName, user_id, userToken, tokenExpirationTime } =
        action.payload;
      state.name = name;
      state.userName = userName;
      state.user_id = user_id;
      state.userToken = userToken;
      state.tokenExpirationTime = tokenExpirationTime;
      state.isLogged = true;
    },
    setSignOutUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setLoginUser, setSignOutUser } = userSlice.actions;

export const selectUserToken = (state) => state.User.userToken;
export const selectTokenExpTime = (state) => state.User.tokenExpirationTime;
export const selectIsLogged = (state) => state.User.isLogged;
export const selectNameUser = (state) => state.User.name;

export default userSlice.reducer;
