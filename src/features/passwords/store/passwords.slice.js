import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAllPaswords, getPasswordValueById, deletePasswordValueById } from '../service/passwords.service';
import { PasswordModalTypes } from '../../../shared/constants/enums';

const initialState = {
  passLoading: false,
  error: null,
  passwordsList: [],
  needUpdate: false,
  passwordSelected: {
    open: false,
    name: '',
    description: '',
    pswdDecrypted: '',
    type: '',
    id: '',
  },
};

export const fetchPasswords = createAsyncThunk('Passwords/fetchPasswords', async ({ refresh = false }, thunkAPI) => {
  const state = thunkAPI.getState().Passwords;
  if (!refresh && state.passwordsList.length > 0) {
    return thunkAPI.fulfillWithValue({
      message: 'No fetch needed',
      passwordsList: state.passwordsList,
    });
  }
  try {
    const { message, passwordsList } = await getAllPaswords();
    return { message, passwordsList };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchPasswordById = createAsyncThunk(
  'Passwords/fetchPasswordById',
  async ({ id, name, description, type }, thunkAPI) => {
    try {
      const { password: pswdDecrypted } = await getPasswordValueById(id);
      return { open: true, name, description, pswdDecrypted, type, id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDeletePasswordById = createAsyncThunk(
  'Passwords/fetchDeletePasswordById',
  async ({ id }, thunkAPI) => {
    try {
      await deletePasswordValueById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const passwordsSlice = createSlice({
  name: 'Passwords',
  initialState,
  reducers: {
    setSignOutPasswords: (state) => {
      state.passLoading = false;
      state.error = null;
      state.passwordsList = [];
      state.passwordSelected = initialState.passwordSelected;
      state.needUpdate = initialState.needUpdate;
    },
    clearPasswordSelected: (state) => {
      state.passwordSelected = initialState.passwordSelected;
    },
    openNewPassword: (state) => {
      state.passwordSelected.open = true;
      state.passwordSelected.type = PasswordModalTypes.NEW;
    },
    openDeletePassword: (state) => {
      state.passwordSelected.type = PasswordModalTypes.DELETE;
    },
    openEditPassword: (state) => {
      state.passwordSelected.type = PasswordModalTypes.EDIT;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPasswords.pending, (state) => {
        //state.passLoading = true;
        state.error = null;
      })
      .addCase(fetchPasswords.fulfilled, (state, action) => {
        //state.passLoading = false;
        state.needUpdate = false;
        state.passwordsList = action.payload.passwordsList;
      })
      .addCase(fetchPasswords.rejected, (state, action) => {
        //state.passLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPasswordById.pending, (state) => {
        state.passLoading = true;
        state.error = null;
      })
      .addCase(fetchPasswordById.fulfilled, (state, action) => {
        state.passLoading = false;
        state.passwordSelected = action.payload;
      })
      .addCase(fetchPasswordById.rejected, (state, action) => {
        state.passLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDeletePasswordById.pending, (state) => {
        state.passLoading = true;
        state.error = null;
        state.passwordSelected.open = false;
      })
      .addCase(fetchDeletePasswordById.fulfilled, (state) => {
        state.passLoading = false;
        state.needUpdate = true;
        state.passwordSelected = initialState.passwordSelected;
      })
      .addCase(fetchDeletePasswordById.rejected, (state, action) => {
        state.passLoading = false;
        state.error = action.payload;
        state.passwordSelected.open = true;
      });
  },
});

export const { setSignOutPasswords, clearPasswordSelected, openNewPassword, openDeletePassword, openEditPassword } =
  passwordsSlice.actions;

export const selectPassLoading = (state) => state.Passwords.passLoading;
export const selectPasswordsList = (state) => state.Passwords.passwordsList;
export const selectIsPasswordsListEmpty = (state) => state.Passwords.passwordsList.length === 0;
export const selectPasswordSelected = (state) => state.Passwords.passwordSelected;
export const selectNeedUpdate = (state) => state.Passwords.needUpdate;
export const selectListLength = (state) => state.Passwords.passwordsList.length;

export default passwordsSlice.reducer;
