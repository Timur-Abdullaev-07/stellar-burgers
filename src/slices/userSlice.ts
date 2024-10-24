import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

export const USER_SLICE_NAME = 'user';

export const loginUser = createAsyncThunk(
  `${USER_SLICE_NAME}/loginUser`,
  async (userData: TLoginData) => loginUserApi(userData)
);

export const registerUser = createAsyncThunk(
  `${USER_SLICE_NAME}/registerUser`,
  async (registerData: TRegisterData) => registerUserApi(registerData)
);

export const logoutUser = createAsyncThunk(
  `${USER_SLICE_NAME}/logoutUser`,
  async () => logoutApi()
);

export const getUserInform = createAsyncThunk(
  `${USER_SLICE_NAME}/getUser`,
  async () => getUserApi()
);

export const updateUser = createAsyncThunk(
  `${USER_SLICE_NAME}/updateUser`,
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  loginUserError: string;
  registerUserError: string;
  logoutUserError: string;
  userRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: '',
  registerUserError: '',
  logoutUserError: '',
  userRequest: false
};

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getLoginUserError: (state) => state.loginUserError,
    getRegisterUserError: (state) => state.registerUserError,
    getLogoutUserError: (state) => state.logoutUserError,
    getUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.userRequest = true;
        state.loginUserError = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userRequest = false;
        state.loginUserError = action.error.message || '';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserError = '';
        state.userRequest = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.userRequest = true;
        state.registerUserError = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userRequest = false;
        state.registerUserError = action.error.message || '';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerUserError = '';
        state.userRequest = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.userRequest = true;
        state.logoutUserError = '';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userRequest = false;
        state.logoutUserError = action.error.message || '';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        if (action.payload.success) {
          localStorage.clear();
          deleteCookie('accessToken');
          state.user = null;
          state.isAuthenticated = false;
        } else {
          state.logoutUserError = 'Возникла ошибка. Повторите еще раз';
        }
      })
      .addCase(getUserInform.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(getUserInform.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      });
  }
});

export const userReducer = userSlice.reducer;
export const {
  getIsAuthenticated,
  getIsAuthChecked,
  getLoginUserError,
  getRegisterUserError,
  getLogoutUserError,
  getUser
} = userSlice.selectors;
