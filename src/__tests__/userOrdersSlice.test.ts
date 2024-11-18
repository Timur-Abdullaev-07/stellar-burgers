import { describe, expect, test } from '@jest/globals';
import {
  userOrdersReducer,
  getAllUserOrders,
  TUserOrdersSlice
} from '../slices/userOrdersSlice';
import { TOrder } from '@utils-types';

describe('userOrdersSlice', () => {
  const initialState: TUserOrdersSlice = {
    orders: [],
    loading: false,
    error: null
  };

  test('userOrdersSlice.pending', () => {
    const referenceState = {
      orders: [],
      loading: true,
      error: null
    };

    const actualState = userOrdersReducer(
      {
        ...initialState,
        error: 'Test Error'
      },
      getAllUserOrders.pending('')
    );

    expect(actualState).toEqual(referenceState);
  });

  test('userOrdersSlice.rejected', () => {
    const error = new Error('Test Error');
    const referenceState = {
      orders: [],
      loading: false,
      error: 'Test Error'
    };

    const actualState = userOrdersReducer(
      {
        ...initialState,
        loading: true
      },
      getAllUserOrders.rejected(error, '')
    );

    expect(actualState).toEqual(referenceState);
  });

  test('userOrdersSlice.fulfilled', () => {
    const orders: TOrder[] = [
      {
        _id: '673b0ab6b27b06001c3e8d8c',
        status: 'done',
        name: 'Флюоресцентный люминесцентный био-марсианский бургер',
        createdAt: '2024-11-18T09:36:54.907Z',
        updatedAt: '2024-11-18T09:36:55.950Z',
        number: 59648,
        ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
      },
      {
        _id: '673af96bb27b06001c3e8d72',
        status: 'done',
        name: 'Экзо-плантаго флюоресцентный фалленианский люминесцентный бургер',
        createdAt: '2024-11-18T08:23:07.696Z',
        updatedAt: '2024-11-18T08:23:08.330Z',
        number: 59647,
        ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
      }
    ];
    const referenceState = {
      orders: orders,
      loading: false,
      error: null
    };

    const actualState = userOrdersReducer(
      {
        ...initialState,
        loading: true
      },
      getAllUserOrders.fulfilled(orders, '')
    );

    expect(actualState).toEqual(referenceState);
  });
});
