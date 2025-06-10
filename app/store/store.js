import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slice/usersSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true,
});
 