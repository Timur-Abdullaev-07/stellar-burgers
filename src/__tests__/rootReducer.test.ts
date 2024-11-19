import { describe, expect, test } from '@jest/globals';
import { rootReducer } from '../services/store';
import { initialState as burgerConstructor } from '../slices/burgerConstructorSlice';
import { initialState as feeds } from '../slices/feedsSlice';
import { initialState as ingredients } from '../slices/ingredientsSlice';
import { initialState as user } from '../slices/userSlice';
import { initialState as UserOrders } from '../slices/userOrdersSlice';

describe('rootReducer', () => {
  test('rootReducer init', () => {
    const referenceState = {
      burgerConstructor,
      feeds,
      ingredients,
      user,
      UserOrders
    };
    const initAction = { type: '@@INIT' };

    const state = rootReducer(undefined, initAction);

    expect(state).toEqual(referenceState);
  });
});
