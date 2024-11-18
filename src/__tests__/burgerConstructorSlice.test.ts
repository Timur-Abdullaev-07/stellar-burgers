import { describe, expect, test } from '@jest/globals';
import {
  burgerConstructorReducer,
  postOrder,
  TBurgerConstructor,
  removeIngredient,
  changeBun,
  clearConstructor,
  moveIngredient
} from '../slices/burgerConstructorSlice';
import { TOrder } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const initialState: TBurgerConstructor = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const order: TOrder = {
    _id: '673b0ab6b27b06001c3e8d8c',
    status: 'done',
    name: 'Флюоресцентный люминесцентный био-марсианский бургер',
    createdAt: '2024-11-18T09:36:54.907Z',
    updatedAt: '2024-11-18T09:36:55.950Z',
    number: 59648,
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
  };

  describe('reducer', () => {
    const bun = {
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
    };

    const ingredient = {
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
    };

    test('removeIngredient', () => {
      const referenceState = {
        ...initialState,
        constructorItems: {
          bun: bun,
          ingredients: []
        }
      };

      const actualState = burgerConstructorReducer(
        {
          ...initialState,
          constructorItems: {
            bun: bun,
            ingredients: [
              {
                ...ingredient,
                id: '1'
              }
            ]
          }
        },
        removeIngredient('1')
      );

      expect(actualState).toEqual(referenceState);
    });

    test('changeBun', () => {
      const referenceState = {
        ...initialState,
        constructorItems: {
          bun: bun,
          ingredients: []
        }
      };

      const actualState = burgerConstructorReducer(
        initialState,
        changeBun(bun)
      );

      expect(actualState).toEqual(referenceState);
    });

    test('clearConstructor', () => {
      const referenceState = initialState;

      const actualState = burgerConstructorReducer(
        {
          ...initialState,
          orderModalData: order,
          constructorItems: {
            bun: bun,
            ingredients: [
              {
                ...ingredient,
                id: '1'
              }
            ]
          }
        },
        clearConstructor()
      );

      expect(actualState).toEqual(referenceState);
    });

    test('moveIngredient', () => {
      const referenceState = {
        ...initialState,
        constructorItems: {
          bun: bun,
          ingredients: [
            {
              ...ingredient,
              id: '2'
            },
            {
              ...ingredient,
              id: '1'
            }
          ]
        }
      };

      const actualState = burgerConstructorReducer(
        {
          ...initialState,
          constructorItems: {
            bun: bun,
            ingredients: [
              {
                ...ingredient,
                id: '1'
              },
              {
                ...ingredient,
                id: '2'
              }
            ]
          }
        },
        moveIngredient({
          id: '1',
          direction: 1
        })
      );

      expect(actualState).toEqual(referenceState);
    });
  });

  describe('extraReducers', () => {
    test('postOrder.pending', () => {
      const referenceState = {
        ...initialState,
        orderRequest: true,
        error: null
      };

      const actualState = burgerConstructorReducer(
        {
          ...initialState,
          error: 'Test Error'
        },
        postOrder.pending('', [])
      );

      expect(actualState).toEqual(referenceState);
    });

    test('postOrder.rejected', () => {
      const error = new Error('Test Error');
      const referenceState = {
        ...initialState,
        error: 'Test Error'
      };

      const actualState = burgerConstructorReducer(
        {
          ...initialState,
          orderRequest: true
        },
        postOrder.rejected(error, '', [])
      );

      expect(actualState).toEqual(referenceState);
    });

    test('postOrder.fulfilled', () => {
      const referenceState = {
        ...initialState,
        orderModalData: order
      };

      const actualState = burgerConstructorReducer(
        {
          ...initialState,
          orderRequest: true
        },
        postOrder.fulfilled(
          {
            success: true,
            name: '',
            order: order
          },
          '',
          []
        )
      );

      expect(actualState).toEqual(referenceState);
    });
  });
});
