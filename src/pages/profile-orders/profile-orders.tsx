import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAllUserOrders,
  getUserOrders,
  getUserOrdersLoading
} from '../../slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);
  const loading = useSelector(getUserOrdersLoading);

  useEffect(() => {
    dispatch(getAllUserOrders());
  }, []);

  if (loading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
