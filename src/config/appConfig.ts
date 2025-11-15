export interface AppConfig {
  jiraBaseUrl?: string;
  gitBaseUrl?: string;
}

const normalizeBaseUrl = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value.endsWith('/') ? value : `${value}/`;
};

export const appConfig: AppConfig = {
  jiraBaseUrl: normalizeBaseUrl(import.meta.env.VITE_JIRA_BASE_URL),
  gitBaseUrl: normalizeBaseUrl(import.meta.env.VITE_GIT_BASE_URL)
};
