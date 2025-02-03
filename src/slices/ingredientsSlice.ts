import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const INGREDIENTS_SLICE_NAME = 'ingredients';

export const getAllIngredients = createAsyncThunk(
  `${INGREDIENTS_SLICE_NAME}/getAll`,
  async () => getIngredientsApi()
);

export type TIngredientSlice = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null;
};

export const initialState: TIngredientSlice = {
  ingredients: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getLoadingIngredients: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getAllIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { getIngredients, getLoadingIngredients } =
  ingredientsSlice.selectors;
