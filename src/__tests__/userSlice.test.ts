import { describe, expect, test } from '@jest/globals';
import {
  userReducer,
  loginUser,
  registerUser,
  logoutUser,
  getUserInform,
  updateUser,
  TUserState
} from '../slices/userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  const initialState: TUserState = {
    isAuthChecked: false,
    isAuthenticated: false,
    user: null,
    loginUserError: '',
    registerUserError: '',
    logoutUserError: '',
    userRequest: false
  };

  const loginData = {
    email: 'test@mail.ru',
    password: '0000'
  };

  const user = {
    email: 'test@mail.ru',
    name: 'nameTest'
  };

  const authResponse = {
    success: true,
    refreshToken: 'test refreshToken',
    accessToken: 'test accessToken',
    user: user
  };

  describe('loginUser', () => {
    test('loginUser.pending', () => {
      const referenceState = {
        ...initialState,
        userRequest: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          loginUserError: 'Test Error'
        },
        loginUser.pending('', loginData)
      );

      expect(actualState).toEqual(referenceState);
    });

    test('loginUser.rejected', () => {
      const error = new Error('Test Error');
      const referenceState = {
        ...initialState,
        loginUserError: 'Test Error',
        isAuthChecked: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          userRequest: true
        },
        loginUser.rejected(error, '', loginData)
      );

      expect(actualState).toEqual(referenceState);
    });

    test('loginUser.fulfilled', () => {
      const referenceState = {
        ...initialState,
        isAuthChecked: true,
        isAuthenticated: true,
        user: user
      };

      const actualState = userReducer(
        {
          ...initialState,
          loginUserError: 'Test Error',
          userRequest: true
        },
        loginUser.fulfilled(authResponse, '', loginData)
      );

      expect(actualState).toEqual(referenceState);
    });
  });

  describe('registerUser', () => {
    test('registerUser.pending', () => {
      const referenceState = {
        ...initialState,
        userRequest: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          registerUserError: 'Test Error'
        },
        registerUser.pending('', {
          ...loginData,
          name: 'nameTest'
        })
      );

      expect(actualState).toEqual(referenceState);
    });

    test('registerUser.rejected', () => {
      const error = new Error('Test Error');
      const referenceState = {
        ...initialState,
        registerUserError: 'Test Error',
        isAuthChecked: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          userRequest: true
        },
        registerUser.rejected(error, '', {
          ...loginData,
          name: 'nameTest'
        })
      );

      expect(actualState).toEqual(referenceState);
    });

    test('registerUser.fulfilled', () => {
      const referenceState = {
        ...initialState,
        isAuthChecked: true,
        isAuthenticated: true,
        user: user
      };

      const actualState = userReducer(
        {
          ...initialState,
          registerUserError: 'Test Error',
          userRequest: true
        },
        registerUser.fulfilled(authResponse, '', {
          ...loginData,
          name: 'nameTest'
        })
      );

      expect(actualState).toEqual(referenceState);
    });
  });

  describe('logoutUser', () => {
    test('logoutUser.pending', () => {
      const referenceState = {
        ...initialState,
        userRequest: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          logoutUserError: 'Test Error'
        },
        logoutUser.pending('')
      );

      expect(actualState).toEqual(referenceState);
    });

    test('logoutUser.rejected', () => {
      const error = new Error('Test Error');
      const referenceState = {
        ...initialState,
        logoutUserError: 'Test Error',
        isAuthChecked: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          userRequest: true
        },
        logoutUser.rejected(error, '')
      );

      expect(actualState).toEqual(referenceState);
    });

    test('logoutUser.fulfilled', () => {
      const referenceState = initialState;

      const actualState = userReducer(
        {
          ...initialState,
          isAuthenticated: true,
          user: user
        },
        logoutUser.fulfilled(authResponse, '')
      );

      expect(actualState).toEqual(referenceState);
    });
  });

  describe('getUserInform', () => {
    test('getUserInform.rejected', () => {
      const error = new Error('Test Error');
      const referenceState = {
        ...initialState,
        isAuthChecked: true
      };

      const actualState = userReducer(
        {
          ...initialState,
          user: user
        },
        getUserInform.rejected(error, '')
      );

      expect(actualState).toEqual(referenceState);
    });

    test('getUserInform.fulfilled', () => {
      const referenceState = {
        ...initialState,
        isAuthChecked: true,
        isAuthenticated: true,
        user: user
      };

      const actualState = userReducer(
        initialState,
        getUserInform.fulfilled(
          {
            success: true,
            user: user
          },
          ''
        )
      );

      expect(actualState).toEqual(referenceState);
    });
  });

  describe('updateUser', () => {
    test('updateUser.fulfilled', () => {
      const referenceState = {
        ...initialState,
        isAuthenticated: true,
        user: {
          ...user,
          name: 'TestNameTwo'
        }
      };

      const actualState = userReducer(
        initialState,
        updateUser.fulfilled(
          {
            success: true,
            user: {
              ...user,
              name: 'TestNameTwo'
            }
          },
          '',
          { name: 'TestNameTwo' }
        )
      );

      expect(actualState).toEqual(referenceState);
    });
  });
});
