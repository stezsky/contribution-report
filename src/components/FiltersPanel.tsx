import React from 'react';

interface FiltersPanelProps {
  months: number;
  onMonthsChange: (value: number) => void;
  teams: string[];
  selectedTeams: string[];
  onTeamsChange: (teams: string[]) => void;
}

const monthOptions = Array.from({ length: 24 }, (_, index) => index + 1);

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  months,
  onMonthsChange,
  teams,
  selectedTeams,
  onTeamsChange
}) => {
  const teamList = Array.isArray(teams) ? teams : [];

  const handleTeamToggle = (team: string) => {
    if (selectedTeams.includes(team)) {
      onTeamsChange(selectedTeams.filter((item) => item !== team));
    } else {
      onTeamsChange([...selectedTeams, team]);
    }
  };

  const handleSelectAll = () => {
    onTeamsChange([...teamList]);
  };

  const handleClearSelection = () => {
    onTeamsChange([]);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Months range</h2>
        <p className="text-sm text-slate-500 mb-3">
          Select the number of months to include in the report.
        </p>
        <div className="flex items-center gap-3">
          <input
            id="months-range"
            type="range"
            min={1}
            max={24}
            value={months}
            onChange={(event) => onMonthsChange(Number(event.target.value))}
            className="w-full"
          />
          <label htmlFor="months-range" className="w-12 text-center font-semibold text-slate-700">
            {months}
          </label>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {monthOptions.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => onMonthsChange(value)}
              className={`px-2 py-1 rounded border ${
                value === months
                  ? 'bg-accent/20 border-accent text-slate-800'
                  : 'border-transparent hover:border-accent hover:text-slate-700'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">Teams</h2>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-accent hover:underline"
              disabled={teamList.length === 0}
            >
              Select all
            </button>
            <button type="button" onClick={handleClearSelection} className="text-slate-500 hover:underline">
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {teamList.map((team) => {
            const isSelected = selectedTeams.includes(team);
            return (
              <label
                key={team}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  isSelected ? 'border-accent bg-accent/10' : 'border-slate-200 hover:border-accent'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={isSelected}
                  onChange={() => handleTeamToggle(team)}
                />
                <span className="text-sm font-medium text-slate-700">{team}</span>
              </label>
            );
          })}
          {teamList.length === 0 && <p className="text-sm text-slate-500">No teams found.</p>}
        </div>
      </div>
    </section>
  );
};

export default FiltersPanel;
