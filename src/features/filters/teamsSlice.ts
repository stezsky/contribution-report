import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../utils/api';

export interface TeamsState {
  items: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: TeamsState = {
  items: [],
  status: 'idle'
};

export const fetchTeams = createAsyncThunk<string[]>('teams/fetch', async () => {
  const response = await apiClient.get<string[]>('/teams');
  return response.data;
});

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default teamsSlice.reducer;
