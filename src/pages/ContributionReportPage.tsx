import React, { useEffect } from 'react';
import FiltersPanel from '../components/FiltersPanel';
import TeamReport from '../components/TeamReport';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchTeams } from '../features/filters/teamsSlice';
import {
  fetchContributions,
  selectContributionsByTeam,
  clearContributions
} from '../features/contributions/contributionsSlice';
import { setMonths, setSelectedTeams } from '../features/filters/filtersSlice';
import { AlertIcon, EmptyStateIcon, InfoIcon, LoadingIcon } from '../components/icons';

const ContributionReportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const months = useAppSelector((state) => state.filters.months);
  const selectedTeams = useAppSelector((state) => state.filters.selectedTeams);
  const teamsState = useAppSelector((state) => state.teams);
  const contributionsState = useAppSelector((state) => state.contributions);
  const contributionsByTeam = useAppSelector(selectContributionsByTeam);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    if (teamsState.status === 'succeeded' && teamsState.items.length > 0 && selectedTeams.length === 0) {
      dispatch(setSelectedTeams([teamsState.items[0]]));
    }
  }, [dispatch, selectedTeams.length, teamsState.items, teamsState.status]);

  useEffect(() => {
    if (selectedTeams.length === 0) {
      dispatch(clearContributions());
      return;
    }

    dispatch(fetchContributions({ months, teams: selectedTeams }));
  }, [dispatch, months, selectedTeams]);

  const handleMonthsChange = (value: number) => {
    dispatch(setMonths(value));
  };

  const handleTeamsChange = (teams: string[]) => {
    dispatch(setSelectedTeams(teams));
  };

  return (
    <>
      <FiltersPanel
        months={months}
        onMonthsChange={handleMonthsChange}
        teams={teamsState.items}
        selectedTeams={selectedTeams}
        onTeamsChange={handleTeamsChange}
      />

      {teamsState.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
            <AlertIcon className="h-6 w-6" />
          </span>
          <span>Failed to load teams: {teamsState.error}</span>
        </div>
      )}

      {contributionsState.status === 'loading' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LoadingIcon className="h-6 w-6 animate-spin" />
          </span>
          <span>Loading contributions...</span>
        </div>
      )}

      {selectedTeams.length === 0 && teamsState.status === 'succeeded' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <InfoIcon className="h-6 w-6" />
          </span>
          <span>Select at least one team to display contribution data.</span>
        </div>
      )}

      {contributionsState.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
            <AlertIcon className="h-6 w-6" />
          </span>
          <span>Failed to load contributions: {contributionsState.error}</span>
        </div>
      )}

      {contributionsState.status === 'succeeded' && Object.keys(contributionsByTeam).length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <EmptyStateIcon className="h-6 w-6" />
          </span>
          <span>No contribution data for the selected filters.</span>
        </div>
      )}

      {Object.entries(contributionsByTeam).map(([teamName, items]) => (
        <TeamReport key={teamName} teamName={teamName} contributions={items} />
      ))}
    </>
  );
};

export default ContributionReportPage;
