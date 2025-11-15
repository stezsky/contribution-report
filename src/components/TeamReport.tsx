import React, { useMemo } from 'react';
import type { SVGProps } from 'react';
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
import {
  BugIcon,
  CalendarIcon,
  ClipboardIcon,
  ColumnsIcon,
  SparkIcon
} from './icons';
import ChartPlaceholder from './ChartPlaceholder';

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

const formatLegendLabel = (value: string | number) => {
  if (typeof value !== 'string') {
    return value;
  }

  const [localPart] = value.split('@');
  return localPart;
};

const legendWrapperStyle: React.CSSProperties = {
  fontSize: '10px',
  marginBottom: '16px'
};

const axisTickStyle: SVGProps<SVGTextElement> = {
  fontSize: 10
};

const tooltipContentStyle: React.CSSProperties = {
  fontSize: '12px'
};

const tooltipItemStyle: React.CSSProperties = {
  fontSize: '12px'
};

const tooltipLabelStyle: React.CSSProperties = {
  fontSize: '11px'
};

const hasStackedSeriesValues = (
  series: Array<Record<string, string | number>>,
  keys: string[]
) => {
  if (series.length === 0 || keys.length === 0) {
    return false;
  }

  return series.some((entry) => keys.some((key) => Number(entry[key] ?? 0) > 0));
};

const hasDeveloperMetric = (
  developers: Array<{ plannedStoryPoints: number; bugCount: number }>,
  key: 'plannedStoryPoints' | 'bugCount'
) => developers.some((developer) => developer[key] > 0);

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

  const monthsDesc = useMemo(
    () => monthsAsc.slice().sort((a, b) => b.localeCompare(a)),
    [monthsAsc]
  );

  const storySeries = useMemo(
    () => buildStackedSeries(monthsDesc, monthDeveloperAggregates),
    [monthsDesc, monthDeveloperAggregates]
  );

  const bugSeries = useMemo(
    () => buildStackedBugSeries(monthsDesc, monthDeveloperAggregates),
    [monthsDesc, monthDeveloperAggregates]
  );

  const developerKeys = useMemo(
    () => developerTotals.map((developer) => developer.email),
    [developerTotals]
  );

  const hasStoryShareData = hasDeveloperMetric(developerTotals, 'plannedStoryPoints');
  const hasBugShareData = hasDeveloperMetric(developerTotals, 'bugCount');
  const hasStoryMonthlyDeveloperData = hasStackedSeriesValues(storySeries, developerKeys);
  const hasBugMonthlyDeveloperData = hasStackedSeriesValues(bugSeries, developerKeys);

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
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-primary">
              <ClipboardIcon className="h-5 w-5" />
            </span>
            Period totals
          </h3>
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
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-primary">
                <SparkIcon className="h-5 w-5" />
              </span>
              Story Points share
            </h3>
            <div className="h-64 min-w-0">
              {hasStoryShareData ? (
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
                    <Tooltip
                      formatter={(value: number) => value.toFixed(1)}
                      contentStyle={tooltipContentStyle}
                      itemStyle={tooltipItemStyle}
                      labelStyle={tooltipLabelStyle}
                    />
                    <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ChartPlaceholder message="No story points data" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-primary">
                <BugIcon className="h-5 w-5" />
              </span>
              Bug share
            </h3>
            <div className="h-64 min-w-0">
              {hasBugShareData ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={developerTotals} dataKey="bugCount" nameKey="email" outerRadius={90} innerRadius={50}>
                      {developerTotals.map((entry, index) => (
                        <Cell key={entry.email} fill={getColor(index)} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipContentStyle}
                      itemStyle={tooltipItemStyle}
                      labelStyle={tooltipLabelStyle}
                    />
                    <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ChartPlaceholder message="No bug data" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-80 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-primary">
              <SparkIcon className="h-5 w-5" />
            </span>
            Story Points per developer
          </h3>
          {hasStoryMonthlyDeveloperData ? (
            <ResponsiveContainer>
              <BarChart data={storySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTickStyle} />
                <YAxis tick={axisTickStyle} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                {developerKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} fill={getColor(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder message="No story developer data" />
          )}
        </div>
        <div className="h-80 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-primary">
              <BugIcon className="h-5 w-5" />
            </span>
            Bugs per developer
          </h3>
          {hasBugMonthlyDeveloperData ? (
            <ResponsiveContainer>
              <BarChart data={bugSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTickStyle} />
                <YAxis allowDecimals={false} tick={axisTickStyle} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                {developerKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} fill={getColor(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder message="No bug developer data" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-80 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-primary">
              <ColumnsIcon className="h-5 w-5" />
            </span>
            Story Points per month
          </h3>
          {hasStoryMonthlyDeveloperData ? (
            <ResponsiveContainer>
              <BarChart data={storySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTickStyle} />
                <YAxis allowDecimals={false} tick={axisTickStyle} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                {developerKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="story" fill={getColor(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder message="No story history" />
          )}
        </div>
        <div className="h-80 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-primary">
              <BugIcon className="h-5 w-5" />
            </span>
            Bugs fixed per month
          </h3>
          {hasBugMonthlyDeveloperData ? (
            <ResponsiveContainer>
              <BarChart data={bugSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTickStyle} />
                <YAxis allowDecimals={false} tick={axisTickStyle} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                {developerKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="bug" fill={getColor(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder message="No bug history" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-primary">
            <CalendarIcon className="h-5 w-5" />
          </span>
          Monthly breakdown
        </h3>
        {monthsDesc.map((month) => {
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
                        {developers.map((developer) => {
                          const detailHash = `#/details/${encodeURIComponent(month)}/${encodeURIComponent(
                            developer.email
                          )}`;
                          return (
                            <tr key={developer.email} className="border-t border-slate-100">
                              <td className="py-2 pr-4 font-medium text-slate-700">
                                <a
                                  href={detailHash}
                                  className="text-accent hover:text-accent/80"
                                >
                                  {developer.email}
                                </a>
                              </td>
                              <td className="py-2 pr-4">{developer.plannedStoryPoints.toFixed(1)}</td>
                              <td className="py-2 pr-4">{developer.storyCount}</td>
                              <td className="py-2 pr-4">{developer.bugCount}</td>
                              <td className="py-2 pr-4">{developer.commitsCount}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="h-64 min-w-0">
                      <h5 className="text-sm font-semibold text-slate-700 mb-2">Story Points share</h5>
                      {hasDeveloperMetric(developers, 'plannedStoryPoints') ? (
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie data={developers} dataKey="plannedStoryPoints" nameKey="email" outerRadius={80}>
                              {developers.map((entry, index) => (
                                <Cell key={entry.email} fill={getColor(index)} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => value.toFixed(1)}
                              contentStyle={tooltipContentStyle}
                              itemStyle={tooltipItemStyle}
                              labelStyle={tooltipLabelStyle}
                            />
                            <Legend
                              formatter={(value) => formatLegendLabel(value)}
                              wrapperStyle={legendWrapperStyle}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <ChartPlaceholder message="No story data" />
                      )}
                    </div>
                    <div className="h-64 min-w-0">
                      <h5 className="text-sm font-semibold text-slate-700 mb-2">Bug share</h5>
                      {hasDeveloperMetric(developers, 'bugCount') ? (
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie data={developers} dataKey="bugCount" nameKey="email" outerRadius={80}>
                              {developers.map((entry, index) => (
                                <Cell key={entry.email} fill={getColor(index)} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={tooltipContentStyle}
                              itemStyle={tooltipItemStyle}
                              labelStyle={tooltipLabelStyle}
                            />
                            <Legend formatter={(value) => formatLegendLabel(value)} wrapperStyle={legendWrapperStyle} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <ChartPlaceholder message="No bug data" />
                      )}
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
