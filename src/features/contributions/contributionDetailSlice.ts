import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../utils/api';
import type { ContributionDetailDto } from '../../types/contributionDetail';

interface FetchDetailParams {
  month: string;
  developer: string;
}

interface ContributionDetailState {
  detail: ContributionDetailDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: ContributionDetailState = {
  detail: null,
  status: 'idle'
};

export const fetchContributionDetail = createAsyncThunk<ContributionDetailDto, FetchDetailParams>(
  'contributionDetail/fetch',
  async ({ month, developer }) => {
    const searchParams = new URLSearchParams();
    searchParams.set('month', month);
    searchParams.set('developer', developer);
    const query = searchParams.toString();
    const endpoint = query.length > 0 ? `/contribution/detail?${query}` : '/contribution/detail';
    const response = await apiClient.get<ContributionDetailDto>(endpoint);
    return response.data;
  }
);

const contributionDetailSlice = createSlice({
  name: 'contributionDetail',
  initialState,
  reducers: {
    clear(state) {
      state.detail = null;
      state.status = 'idle';
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributionDetail.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchContributionDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(fetchContributionDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clear: clearContributionDetail } = contributionDetailSlice.actions;

export default contributionDetailSlice.reducer;
