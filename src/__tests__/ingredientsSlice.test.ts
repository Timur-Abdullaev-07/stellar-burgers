import { describe, expect, test } from '@jest/globals';
import {
  ingredientsReducer,
  getAllIngredients,
  initialState
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  test('getAllIngredients.pending', () => {
    const referenceState = {
      ingredients: [],
      loading: true,
      error: null
    };

    const actualState = ingredientsReducer(
      {
        ...initialState,
        error: 'Test Error'
      },
      getAllIngredients.pending('')
    );

    expect(actualState).toEqual(referenceState);
  });

  test('getAllIngredients.rejected', () => {
    const error = new Error('Test Error');
    const referenceState = {
      ingredients: [],
      loading: false,
      error: 'Test Error'
    };

    const actualState = ingredientsReducer(
      {
        ...initialState,
        loading: true
      },
      getAllIngredients.rejected(error, '')
    );

    expect(actualState).toEqual(referenceState);
  });

  test('getAllIngredients.fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
      },
      {
        _id: '643d69a5c3f7b9001cfa0940',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png'
      }
    ];
    const referenceState = {
      ingredients: ingredients,
      loading: false,
      error: null
    };

    const actualState = ingredientsReducer(
      {
        ...initialState,
        loading: true
      },
      getAllIngredients.fulfilled(ingredients, '')
    );

    expect(actualState).toEqual(referenceState);
  });
});
