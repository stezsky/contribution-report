import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../utils/api';
import type {
  CommitContributionDto,
  ContributionDetailDto,
  JiraContributionDto
} from '../../types/contributionDetail';

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

const isBug = (type?: string) => type?.toLowerCase() === 'bug';

const buildQuery = ({ month, developer }: FetchDetailParams) => {
  const searchParams = new URLSearchParams();
  if (developer) {
    searchParams.set('email', developer);
  }
  if (month) {
    searchParams.set('month', month);
  }

  return searchParams.toString();
};

const calculateSummary = (
  jira: JiraContributionDto[],
  commits: CommitContributionDto[]
): Pick<ContributionDetailDto, 'totalStoryPoints' | 'totalBugs' | 'totalCommits'> => ({
  totalStoryPoints: jira.reduce((total, item) => total + (item.storyPoints ?? 0), 0),
  totalBugs: jira.filter((item) => isBug(item.type)).length,
  totalCommits: commits.length
});

export const fetchContributionDetail = createAsyncThunk<ContributionDetailDto, FetchDetailParams>(
  'contributionDetail/fetch',
  async ({ month, developer }) => {
    const query = buildQuery({ month, developer });
    const endpointSuffix = query.length > 0 ? `?${query}` : '';

    const [jiraResponse, commitResponse] = await Promise.all([
      apiClient.get<JiraContributionDto[]>(`/contribution/jira${endpointSuffix}`),
      apiClient.get<CommitContributionDto[]>(`/contribution/commit${endpointSuffix}`)
    ]);

    const jiraContributions = jiraResponse.data ?? [];
    const commitContributions = commitResponse.data ?? [];
    const summary = calculateSummary(jiraContributions, commitContributions);

    return {
      month,
      developerEmail: developer,
      totalStoryPoints: summary.totalStoryPoints,
      totalBugs: summary.totalBugs,
      totalCommits: summary.totalCommits,
      jiraContributions,
      commitContributions
    } satisfies ContributionDetailDto;
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
