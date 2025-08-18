import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { hideLoader, showLoader } from '../store/slices/uiSlice';
import { UseLoaderReturn } from '../types';

export const useLoader = (): UseLoaderReturn => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.ui.isLoading);

  const show = () => dispatch(showLoader());
  const hide = () => dispatch(hideLoader());

  return {
    isLoading,
    showLoader: show,
    hideLoader: hide,
  };
};
