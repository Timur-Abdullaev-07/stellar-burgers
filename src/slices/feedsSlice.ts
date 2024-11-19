import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const FEEDS_SLICE_NAME = 'feeds';

export const getAllUsersOrders = createAsyncThunk(
  `${FEEDS_SLICE_NAME}/getAll`,
  async () => getFeedsApi()
);

export type TFeedSlice = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

export const initialState: TFeedSlice = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedsSlice = createSlice({
  name: FEEDS_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    getAllOrders: (state) => state.orders,
    getLoadingOrders: (state) => state.loading,
    getFeedsTotal: (state) => state.total,
    getFeedsTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getAllUsersOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const feedsReducer = feedsSlice.reducer;
export const {
  getAllOrders,
  getLoadingOrders,
  getFeedsTotal,
  getFeedsTotalToday
} = feedsSlice.selectors;
