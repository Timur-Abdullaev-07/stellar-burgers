import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../slices/ingredientsSlice';
import { getOrderByNumberApi } from '@api';
import { getUserOrders } from '../../slices/userOrdersSlice';
import { getAllOrders } from '../../slices/feedsSlice';

export const OrderInfo: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(getIngredients);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const userOrders = useSelector(getUserOrders);
  const allOrders = useSelector(getAllOrders);

  useEffect(() => {
    let order =
      userOrders.find((order) => order.number.toString() === id) || null;
    if (!order) {
      order = allOrders.find((order) => order.number.toString() === id) || null;
    }
    if (!order) {
      getOrderByNumberApi(parseInt(id || ''))
        .then((data) => setOrderData(data.orders[0]))
        .catch((err) => console.log(err));
    } else setOrderData(order);
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
