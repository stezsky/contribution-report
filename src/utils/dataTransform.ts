import type { MonthlyContributionDto } from '../types/contribution';

export const formatMonth = (month: string): string => {
  const date = new Date(month);
  if (Number.isNaN(date.getTime())) {
    return month;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export interface DeveloperAggregate {
  email: string;
  plannedStoryPoints: number;
  storyCount: number;
  bugCount: number;
  commitsCount: number;
}

export interface MonthAggregate extends DeveloperAggregate {
  month: string;
}

export const aggregateByDeveloper = (records: MonthlyContributionDto[]): DeveloperAggregate[] => {
  const byEmail = new Map<string, DeveloperAggregate>();

  records.forEach((item) => {
    const entry = byEmail.get(item.email) ?? {
      email: item.email,
      plannedStoryPoints: 0,
      storyCount: 0,
      bugCount: 0,
      commitsCount: 0
    };

    entry.plannedStoryPoints += item.plannedStoryPoints ?? 0;
    entry.storyCount += item.storyCount ?? 0;
    entry.bugCount += item.bugCount ?? 0;
    entry.commitsCount += item.commitsCount ?? 0;

    byEmail.set(item.email, entry);
  });

  return Array.from(byEmail.values()).sort((a, b) => b.plannedStoryPoints - a.plannedStoryPoints);
};

export const aggregateByMonth = (records: MonthlyContributionDto[]): MonthAggregate[] => {
  const byMonth = new Map<string, MonthAggregate>();

  records.forEach((item) => {
    const monthKey = formatMonth(item.month);
    const entry = byMonth.get(monthKey) ?? {
      month: monthKey,
      email: 'all',
      plannedStoryPoints: 0,
      storyCount: 0,
      bugCount: 0,
      commitsCount: 0
    };

    entry.plannedStoryPoints += item.plannedStoryPoints ?? 0;
    entry.storyCount += item.storyCount ?? 0;
    entry.bugCount += item.bugCount ?? 0;
    entry.commitsCount += item.commitsCount ?? 0;

    byMonth.set(monthKey, entry);
  });

  return Array.from(byMonth.values()).sort((a, b) => (a.month < b.month ? 1 : -1));
};

export const aggregateByMonthAndDeveloper = (
  records: MonthlyContributionDto[]
): Record<string, DeveloperAggregate[]> => {
  const byMonth = new Map<string, Map<string, DeveloperAggregate>>();

  records.forEach((item) => {
    const monthKey = formatMonth(item.month);
    const monthMap = byMonth.get(monthKey) ?? new Map<string, DeveloperAggregate>();
    const developerEntry = monthMap.get(item.email) ?? {
      email: item.email,
      plannedStoryPoints: 0,
      storyCount: 0,
      bugCount: 0,
      commitsCount: 0
    };

    developerEntry.plannedStoryPoints += item.plannedStoryPoints ?? 0;
    developerEntry.storyCount += item.storyCount ?? 0;
    developerEntry.bugCount += item.bugCount ?? 0;
    developerEntry.commitsCount += item.commitsCount ?? 0;

    monthMap.set(item.email, developerEntry);
    byMonth.set(monthKey, monthMap);
  });

  const result: Record<string, DeveloperAggregate[]> = {};
  Array.from(byMonth.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .forEach(([month, developers]) => {
      result[month] = Array.from(developers.values()).sort(
        (a, b) => b.plannedStoryPoints - a.plannedStoryPoints
      );
    });

  return result;
};

export const buildStackedSeries = (
  months: string[],
  aggregated: Record<string, DeveloperAggregate[]>
): Array<Record<string, string | number>> => {
  return months.map((month) => {
    const developers = aggregated[month] ?? [];
    return developers.reduce<Record<string, string | number>>(
      (acc, developer) => {
        acc.month = month;
        acc[developer.email] = developer.plannedStoryPoints;
        return acc;
      },
      { month }
    );
  });
};

export const buildStackedBugSeries = (
  months: string[],
  aggregated: Record<string, DeveloperAggregate[]>
): Array<Record<string, string | number>> => {
  return months.map((month) => {
    const developers = aggregated[month] ?? [];
    return developers.reduce<Record<string, string | number>>(
      (acc, developer) => {
        acc.month = month;
        acc[developer.email] = developer.bugCount;
        return acc;
      },
      { month }
    );
  });
};
