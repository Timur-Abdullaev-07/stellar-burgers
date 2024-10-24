import { orderBurgerApi } from '@api';
import {
  createSlice,
  PayloadAction,
  nanoid,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export const BURGER_CONSTRUCTOR_SLICE_NAME = 'burgerConstructor';

type TBurgerConstructor = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: Array<TConstructorIngredient>;
  };
  orderRequest: boolean;
  orderModalData: null | TOrder;
  error: null | string;
};

const initialState: TBurgerConstructor = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const postOrder = createAsyncThunk(
  `${BURGER_CONSTRUCTOR_SLICE_NAME}/POST`,
  async (order: string[]) => orderBurgerApi(order)
);

const burgerConstructorSlice = createSlice({
  name: BURGER_CONSTRUCTOR_SLICE_NAME,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    changeBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    clearConstructor: (state) => {
      state.orderModalData = null;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: number }>
    ) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ing) => ing.id === action.payload.id
      );
      state.constructorItems.ingredients[index] =
        state.constructorItems.ingredients.splice(
          index + action.payload.direction,
          1,
          state.constructorItems.ingredients[index]
        )[0];
    }
  },
  selectors: {
    getBurgerIngredients: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getConstructorItems: (state) => state.constructorItems
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  changeBun,
  clearConstructor,
  moveIngredient
} = burgerConstructorSlice.actions;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const {
  getBurgerIngredients,
  getOrderRequest,
  getOrderModalData,
  getConstructorItems
} = burgerConstructorSlice.selectors;
