import { describe, expect, test } from '@jest/globals';
import {
  feedsReducer,
  getAllUsersOrders,
  TFeedSlice
} from '../slices/feedsSlice';
import { TOrder } from '@utils-types';

describe('feedsSlice', () => {
  const initialState: TFeedSlice = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  test('feedsSlice.pending', () => {
    const referenceState = {
      orders: [],
      total: 0,
      totalToday: 0,
      loading: true,
      error: null
    };

    const actualState = feedsReducer(
      {
        ...initialState,
        error: 'Test Error'
      },
      getAllUsersOrders.pending('')
    );

    expect(actualState).toEqual(referenceState);
  });

  test('feedsSlice.rejected', () => {
    const error = new Error('Test Error');
    const referenceState = {
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: 'Test Error'
    };

    const actualState = feedsReducer(
      {
        ...initialState,
        loading: true
      },
      getAllUsersOrders.rejected(error, '')
    );

    expect(actualState).toEqual(referenceState);
  });

  test('feedsSlice.fulfilled', () => {
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
      total: 59274,
      totalToday: 52,
      loading: false,
      error: null
    };

    const actualState = feedsReducer(
      {
        ...initialState,
        loading: true
      },
      getAllUsersOrders.fulfilled(
        {
          success: true,
          orders: orders,
          total: 59274,
          totalToday: 52
        },
        ''
      )
    );

    expect(actualState).toEqual(referenceState);
  });
});
