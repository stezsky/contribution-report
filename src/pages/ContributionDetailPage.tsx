import React, { useEffect, useMemo } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchContributionDetail,
  clearContributionDetail
} from '../features/contributions/contributionDetailSlice';
import { formatMonth } from '../utils/dataTransform';
import { appConfig } from '../config/appConfig';

interface ContributionDetailPageProps {
  month: string;
  developer: string;
  onBack: () => void;
}

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const formatChange = (added?: number, deleted?: number) => {
  const safeAdded = added ?? 0;
  const safeDeleted = deleted ?? 0;
  return `+${safeAdded} -${safeDeleted}`;
};

const abbreviateCommitMessage = (message: string) => {
  const firstLine = message.split(/\r?\n/)[0] ?? '';
  if (firstLine.length <= 120) {
    return firstLine;
  }

  return `${firstLine.slice(0, 117)}...`;
};

const ContributionDetailPage: React.FC<ContributionDetailPageProps> = ({ month, developer, onBack }) => {
  const dispatch = useAppDispatch();
  const { detail, status, error } = useAppSelector((state) => state.contributionDetail);

  useEffect(() => {
    dispatch(fetchContributionDetail({ month, developer }));

    return () => {
      dispatch(clearContributionDetail());
    };
  }, [dispatch, month, developer]);

  const displayMonth = detail?.month ?? month ?? '';
  const formattedMonth = useMemo(() => formatMonth(displayMonth), [displayMonth]);
  const displayDeveloper = detail?.developerName ?? detail?.developerEmail ?? developer ?? 'Unknown';

  const jiraBaseUrl = appConfig.jiraBaseUrl;
  const gitBaseUrl = appConfig.gitBaseUrl;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Contribution details for {displayDeveloper} in {formattedMonth}
          </h2>
          <p className="text-sm text-slate-500">Detailed activity overview for the selected month.</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-left text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          ← Back to monthly report
        </button>
      </div>

      {status === 'loading' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center text-slate-500">
          Loading contribution details...
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-6 text-center text-red-600">
          Failed to load contribution details: {error}
        </div>
      )}

      {status === 'succeeded' && detail && (
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Summary</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border border-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">Story points</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {detail.totalStoryPoints.toFixed(1)}
                </p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">Stories</p>
                <p className="text-2xl font-semibold text-slate-900">{detail.totalStories}</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">Bugs fixed</p>
                <p className="text-2xl font-semibold text-slate-900">{detail.totalBugs}</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">Commits</p>
                <p className="text-2xl font-semibold text-slate-900">{detail.totalCommits}</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <header className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-800">Jira contributions</h3>
              <p className="text-sm text-slate-500">
                Jira tasks implemented by {displayDeveloper} during {formattedMonth}.
              </p>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500 uppercase text-[0.65rem] tracking-wide">
                    <th className="py-2 pr-4">Jira task</th>
                    <th className="py-2 pr-4">First commit</th>
                    <th className="py-2 pr-4">Summary</th>
                    <th className="py-2 pr-4">Story points</th>
                    <th className="py-2 pr-4">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.jiraContributions.length === 0 && (
                    <tr>
                      <td className="py-4 text-center text-slate-500" colSpan={5}>
                        No Jira tasks recorded for this month.
                      </td>
                    </tr>
                  )}
                  {detail.jiraContributions.map((jira) => {
                    const jiraUrl = jiraBaseUrl ? `${jiraBaseUrl}${jira.jiraTaskId}` : undefined;
                    return (
                      <tr key={jira.jiraTaskId} className="border-t border-slate-100">
                        <td className="py-2 pr-4 font-medium text-slate-700">
                          {jiraUrl ? (
                            <a
                              href={jiraUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:text-accent/80"
                            >
                              {jira.jiraTaskId}
                            </a>
                          ) : (
                            jira.jiraTaskId
                          )}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">{formatDate(jira.firstCommitDate)}</td>
                        <td className="py-2 pr-4 max-w-sm">
                          {jira.summary ? (
                            jiraUrl ? (
                              <a
                                href={jiraUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent hover:text-accent/80"
                              >
                                {jira.summary}
                              </a>
                            ) : (
                              jira.summary
                            )
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-2 pr-4">{jira.storyPoints ?? '-'}</td>
                        <td className="py-2 pr-4">{jira.type ?? '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <header className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-800">Commit contributions</h3>
              <p className="text-sm text-slate-500">
                Commits made by {displayDeveloper} during {formattedMonth}.
              </p>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500 uppercase text-[0.65rem] tracking-wide">
                    <th className="py-2 pr-4">Repository</th>
                    <th className="py-2 pr-4">Jira task</th>
                    <th className="py-2 pr-4">Commit</th>
                    <th className="py-2 pr-4">Message</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Source</th>
                    <th className="py-2 pr-4">Tests</th>
                    <th className="py-2 pr-4">Other</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.commitContributions.length === 0 && (
                    <tr>
                      <td className="py-4 text-center text-slate-500" colSpan={8}>
                        No commits recorded for this month.
                      </td>
                    </tr>
                  )}
                  {detail.commitContributions.map((commit) => {
                    const commitUrl = gitBaseUrl ? `${gitBaseUrl}${commit.commitId}` : undefined;
                    const commitJiraUrl = commit.jiraTaskId && jiraBaseUrl ? `${jiraBaseUrl}${commit.jiraTaskId}` : undefined;
                    return (
                      <tr key={commit.commitId} className="border-t border-slate-100">
                        <td className="py-2 pr-4 whitespace-nowrap">{commit.repositoryName ?? '-'}</td>
                        <td className="py-2 pr-4 font-medium text-slate-700">
                          {commit.jiraTaskId ? (
                            commitJiraUrl ? (
                              <a
                                href={commitJiraUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent hover:text-accent/80"
                              >
                                {commit.jiraTaskId}
                              </a>
                            ) : (
                              commit.jiraTaskId
                            )
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-2 pr-4 font-medium text-slate-700 whitespace-nowrap">
                          {commitUrl ? (
                            <a
                              href={commitUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:text-accent/80"
                            >
                              {commit.commitId}
                            </a>
                          ) : (
                            commit.commitId
                          )}
                        </td>
                        <td className="py-2 pr-4 max-w-md">{abbreviateCommitMessage(commit.commitMessage)}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{formatDate(commit.commitDate)}</td>
                        <td className="py-2 pr-4">{formatChange(commit.srcAdded, commit.srcDeleted)}</td>
                        <td className="py-2 pr-4">{formatChange(commit.testAdded, commit.testDeleted)}</td>
                        <td className="py-2 pr-4">{formatChange(commit.othersAdded, commit.othersDeleted)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default ContributionDetailPage;
