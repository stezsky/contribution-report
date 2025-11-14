export interface MonthlyContributionDto {
  month: string;
  teamName: string;
  email: string;
  plannedStoryPoints: number;
  storyCount: number;
  bugCount: number;
  commitsCount: number;
  commitsWithJiraTask?: number;
  srcChanges?: number;
  srcChangesRatio?: number;
  testChanges?: number;
  testChangesRatio?: number;
  otherChanges?: number;
  otherChangesRatio?: number;
  gitContribution?: number;
}

export type ContributionByDeveloper = Record<string, MonthlyContributionDto[]>;
