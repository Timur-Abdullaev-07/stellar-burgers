import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const USER_ORDERS_SLICE_NAME = 'UserOrders';

export const getAllUserOrders = createAsyncThunk(
  `${USER_ORDERS_SLICE_NAME}/getAll`,
  async () => getOrdersApi()
);

type TUserOrdersSlice = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TUserOrdersSlice = {
  orders: [],
  loading: false,
  error: null
};

const allOrdersSlice = createSlice({
  name: USER_ORDERS_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    getUserOrders: (state) => state.orders,
    getUserOrdersLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getAllUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export const userOrdersReducer = allOrdersSlice.reducer;
export const { getUserOrders, getUserOrdersLoading } = allOrdersSlice.selectors;
