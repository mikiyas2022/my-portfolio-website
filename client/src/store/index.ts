import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import portfolioReducer from './slices/portfolioSlice';
import { AuthState, PortfolioState } from '../types';

export interface RootState {
  auth: AuthState;
  portfolio: PortfolioState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 