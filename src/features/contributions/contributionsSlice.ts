import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../utils/api';
import type { MonthlyContributionDto } from '../../types/contribution';
import type { RootState } from '../../store/store';

export interface ContributionsState {
  items: MonthlyContributionDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: ContributionsState = {
  items: [],
  status: 'idle'
};

interface FetchParams {
  months: number;
  teams: string[];
}

export const fetchContributions = createAsyncThunk<MonthlyContributionDto[], FetchParams>(
  'contributions/fetch',
  async (params) => {
    const searchParams = new URLSearchParams();
    searchParams.set('months', params.months.toString());
    params.teams.forEach((team) => {
      searchParams.append('squads', team);
    });
    const query = searchParams.toString();
    const endpoint = query.length > 0 ? `/contribution/monthly?${query}` : '/contribution/monthly';
    const response = await apiClient.get<MonthlyContributionDto[]>(endpoint);
    return response.data;
  }
);

const contributionsSlice = createSlice({
  name: 'contributions',
  initialState,
  reducers: {
    clear(state) {
      state.items = [];
      state.status = 'idle';
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributions.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchContributions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchContributions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clear: clearContributions } = contributionsSlice.actions;

export const selectContributionsByTeam = (state: RootState) => {
  return state.contributions.items.reduce<Record<string, MonthlyContributionDto[]>>(
    (acc, item) => {
      const team = item.teamName ?? 'Unknown';
      const teamItems = acc[team] ?? [];
      teamItems.push(item);
      acc[team] = teamItems;
      return acc;
    },
    {}
  );
};

export default contributionsSlice.reducer;
