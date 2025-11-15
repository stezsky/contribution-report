import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../features/filters/filtersSlice';
import teamsReducer from '../features/filters/teamsSlice';
import contributionsReducer from '../features/contributions/contributionsSlice';
import contributionDetailReducer from '../features/contributions/contributionDetailSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    teams: teamsReducer,
    contributions: contributionsReducer,
    contributionDetail: contributionDetailReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
