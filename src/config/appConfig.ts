export interface AppConfig {
  jiraBaseUrl?: string;
  gitBaseUrl?: string;
  gitRepositoryBaseUrl?: string;
}

const DEFAULT_JIRA_BASE_URL = 'https://jira-agile.oskarmobil.cz/browse/';
const DEFAULT_GIT_REPOSITORY_BASE_URL = 'https://github.com/VFCZ-Digital/';

const normalizeBaseUrl = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value.endsWith('/') ? value : `${value}/`;
};

const normalizedJiraBaseUrl = normalizeBaseUrl(import.meta.env.VITE_JIRA_BASE_URL);
const normalizedGitRepositoryBaseUrl =
  normalizeBaseUrl(import.meta.env.VITE_GIT_REPOSITORY_BASE_URL) ?? DEFAULT_GIT_REPOSITORY_BASE_URL;

export const appConfig: AppConfig = {
  jiraBaseUrl: normalizedJiraBaseUrl ?? DEFAULT_JIRA_BASE_URL,
  gitBaseUrl: normalizeBaseUrl(import.meta.env.VITE_GIT_BASE_URL),
  gitRepositoryBaseUrl: normalizedGitRepositoryBaseUrl
};
