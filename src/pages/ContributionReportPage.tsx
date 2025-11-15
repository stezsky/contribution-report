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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
          Failed to load teams: {teamsState.error}
        </div>
      )}

      {contributionsState.status === 'loading' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          Loading contributions...
        </div>
      )}

      {selectedTeams.length === 0 && teamsState.status === 'succeeded' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          Select at least one team to display contribution data.
        </div>
      )}

      {contributionsState.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
          Failed to load contributions: {contributionsState.error}
        </div>
      )}

      {contributionsState.status === 'succeeded' && Object.keys(contributionsByTeam).length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No contribution data for the selected filters.
        </div>
      )}

      {Object.entries(contributionsByTeam).map(([teamName, items]) => (
        <TeamReport key={teamName} teamName={teamName} contributions={items} />
      ))}
    </>
  );
};

export default ContributionReportPage;
