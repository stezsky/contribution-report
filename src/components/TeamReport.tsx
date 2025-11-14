import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';
import type { MonthlyContributionDto } from '../types/contribution';
import {
  aggregateByDeveloper,
  aggregateByMonth,
  aggregateByMonthAndDeveloper,
  buildStackedBugSeries,
  buildStackedSeries
} from '../utils/dataTransform';

interface TeamReportProps {
  teamName: string;
  contributions: MonthlyContributionDto[];
}

const palette = [
  '#0ea5e9',
  '#6366f1',
  '#f97316',
  '#22c55e',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#0ea5e9'
];

const getColor = (index: number) => palette[index % palette.length];

const TeamReport: React.FC<TeamReportProps> = ({ teamName, contributions }) => {
  const developerTotals = useMemo(() => aggregateByDeveloper(contributions), [contributions]);
  const monthlyTotals = useMemo(() => aggregateByMonth(contributions), [contributions]);
  const monthDeveloperAggregates = useMemo(
    () => aggregateByMonthAndDeveloper(contributions),
    [contributions]
  );

  const monthsAsc = useMemo(
    () => Object.keys(monthDeveloperAggregates).sort((a, b) => a.localeCompare(b)),
    [monthDeveloperAggregates]
  );

  const storySeries = useMemo(
    () => buildStackedSeries(monthsAsc, monthDeveloperAggregates),
    [monthsAsc, monthDeveloperAggregates]
  );

  const bugSeries = useMemo(
    () => buildStackedBugSeries(monthsAsc, monthDeveloperAggregates),
    [monthsAsc, monthDeveloperAggregates]
  );

  const developerKeys = useMemo(
    () => developerTotals.map((developer) => developer.email),
    [developerTotals]
  );

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">{teamName}</h2>
        <p className="text-sm text-slate-500">
          {contributions.length} contribution records found in the selected period.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Period totals</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 uppercase text-xs tracking-wide">
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2 pr-4">Story Points</th>
                  <th className="py-2 pr-4">Stories</th>
                  <th className="py-2 pr-4">Bugs</th>
                  <th className="py-2 pr-4">Commits</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTotals.map((row) => (
                  <tr key={row.month} className="border-t border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-700">{row.month}</td>
                    <td className="py-2 pr-4">{row.plannedStoryPoints.toFixed(1)}</td>
                    <td className="py-2 pr-4">{row.storyCount}</td>
                    <td className="py-2 pr-4">{row.bugCount}</td>
                    <td className="py-2 pr-4">{row.commitsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800">Story Points share</h3>
            <div className="h-64 min-w-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={developerTotals}
                    dataKey="plannedStoryPoints"
                    nameKey="email"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {developerTotals.map((entry, index) => (
                      <Cell key={entry.email} fill={getColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => value.toFixed(1)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800">Bug share</h3>
            <div className="h-64 min-w-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={developerTotals} dataKey="bugCount" nameKey="email" outerRadius={90} innerRadius={50}>
                    {developerTotals.map((entry, index) => (
                      <Cell key={entry.email} fill={getColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {developerKeys.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-80 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Story Points per month</h3>
            <ResponsiveContainer>
              <BarChart data={storySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                {developerKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="story" fill={getColor(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Bugs fixed per month</h3>
            <ResponsiveContainer>
              <BarChart data={bugSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                {developerKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="bug" fill={getColor(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Monthly breakdown</h3>
        {monthsAsc
          .slice()
          .sort((a, b) => b.localeCompare(a))
          .map((month) => {
            const developers = monthDeveloperAggregates[month] ?? [];
            return (
              <article key={month} className="border border-slate-100 rounded-xl p-4">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                  <h4 className="text-xl font-semibold text-slate-800">{month}</h4>
                  <p className="text-sm text-slate-500">
                    {developers.length} contributor{developers.length === 1 ? '' : 's'} in this month.
                  </p>
                </header>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 uppercase text-xs tracking-wide">
                          <th className="py-2 pr-4">Developer</th>
                          <th className="py-2 pr-4">Story Points</th>
                          <th className="py-2 pr-4">Stories</th>
                          <th className="py-2 pr-4">Bugs</th>
                          <th className="py-2 pr-4">Commits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {developers.map((developer) => (
                          <tr key={developer.email} className="border-t border-slate-100">
                            <td className="py-2 pr-4 font-medium text-slate-700">{developer.email}</td>
                            <td className="py-2 pr-4">{developer.plannedStoryPoints.toFixed(1)}</td>
                            <td className="py-2 pr-4">{developer.storyCount}</td>
                            <td className="py-2 pr-4">{developer.bugCount}</td>
                            <td className="py-2 pr-4">{developer.commitsCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="h-64 min-w-0">
                      <h5 className="text-sm font-semibold text-slate-700 mb-2">Story Points share</h5>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={developers} dataKey="plannedStoryPoints" nameKey="email" outerRadius={80}>
                            {developers.map((entry, index) => (
                              <Cell key={entry.email} fill={getColor(index)} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => value.toFixed(1)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-64 min-w-0">
                      <h5 className="text-sm font-semibold text-slate-700 mb-2">Bug share</h5>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={developers} dataKey="bugCount" nameKey="email" outerRadius={80}>
                            {developers.map((entry, index) => (
                              <Cell key={entry.email} fill={getColor(index)} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default TeamReport;
