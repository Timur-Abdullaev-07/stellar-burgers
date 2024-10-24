import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  changeBun,
  clearConstructor,
  getBurgerIngredients,
  getOrderModalData,
  getOrderRequest,
  postOrder
} from '../../slices/burgerConstructorSlice';
import { getIngredients } from '../../slices/ingredientsSlice';
import { getIsAuthenticated } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const constructorItems = useSelector(getBurgerIngredients);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();

  //если булочки нет, то берем первую из списка
  /*   if (!constructorItems.bun) {
    const firstBun = useSelector(getIngredients).find(
      (ingredient) => ingredient.type === 'bun'
    );
    if (firstBun) dispatch(changeBun(firstBun));
  } */

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const order = constructorItems.ingredients.map((ing) => ing._id);
    order.unshift(constructorItems.bun._id);
    order.push(constructorItems.bun._id);
    dispatch(postOrder(order));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
