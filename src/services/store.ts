import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  BURGER_CONSTRUCTOR_SLICE_NAME,
  burgerConstructorReducer
} from '../slices/burgerConstructorSlice';
import { FEEDS_SLICE_NAME, feedsReducer } from '../slices/feedsSlice';
import {
  INGREDIENTS_SLICE_NAME,
  ingredientsReducer
} from '../slices/ingredientsSlice';
import { USER_SLICE_NAME, userReducer } from '../slices/userSlice';
import {
  USER_ORDERS_SLICE_NAME,
  userOrdersReducer
} from '../slices/userOrdersSlice';

const rootReducer = combineReducers({
  [INGREDIENTS_SLICE_NAME]: ingredientsReducer,
  [BURGER_CONSTRUCTOR_SLICE_NAME]: burgerConstructorReducer,
  [FEEDS_SLICE_NAME]: feedsReducer,
  [USER_SLICE_NAME]: userReducer,
  [USER_ORDERS_SLICE_NAME]: userOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
