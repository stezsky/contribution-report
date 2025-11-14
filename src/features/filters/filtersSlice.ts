import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  months: number;
  selectedTeams: string[];
}

const initialState: FiltersState = {
  months: 3,
  selectedTeams: []
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMonths(state, action: PayloadAction<number>) {
      state.months = action.payload;
    },
    setSelectedTeams(state, action: PayloadAction<string[]>) {
      state.selectedTeams = action.payload;
    }
  }
});

export const { setMonths, setSelectedTeams } = filtersSlice.actions;
export default filtersSlice.reducer;
