import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAllOrders,
  getAllUsersOrders,
  getLoadingOrders
} from '../../slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getAllOrders);
  const loadingAllOrders = useSelector(getLoadingOrders);

  useEffect(() => {
    dispatch(getAllUsersOrders());
  }, []);

  if (loadingAllOrders) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getAllUsersOrders());
      }}
    />
  );
};
