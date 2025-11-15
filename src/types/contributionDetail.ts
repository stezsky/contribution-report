export interface JiraContributionDto {
  jiraTaskId: string;
  firstCommitDate: string;
  summary: string;
  storyPoints: number;
  status: string;
  type: string;
}

export interface CommitContributionDto {
  commitId: string;
  commitMessage: string;
  commitDate: string;
  repositoryName?: string;
  jiraTaskId?: string;
  srcAdded: number;
  srcDeleted: number;
  testAdded: number;
  testDeleted: number;
  othersAdded: number;
  othersDeleted: number;
}

export interface ContributionDetailDto {
  month: string;
  developerEmail: string;
  developerName?: string;
  totalStoryPoints: number;
  totalBugs: number;
  totalCommits: number;
  jiraContributions: JiraContributionDto[];
  commitContributions: CommitContributionDto[];
}
