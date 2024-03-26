import { useMemo } from 'react';
import type { Issue } from 'src/common';
import { getSelectedEditionSlug } from 'src/hooks/use-edition-provider';
import {
	formatDayNumber,
	formatMonth,
	formatWeekday,
	londonTime,
	londonTimeAsDate,
} from './date';

interface IssueDate {
	date: string;
	weekday: string;
}

export const renderIssueDate = (dateString: Issue['date']): IssueDate => {
	const date = londonTime(new Date(dateString));
	return {
		date: `${formatDayNumber(date)} ${formatMonth(date)}`,
		weekday: formatWeekday(date),
	};
};

export const useIssueDate = (issue?: {
	date: string;
	key: string;
}): IssueDate =>
	useMemo(
		() => (issue ? renderIssueDate(issue.date) : { date: '', weekday: '' }),
		[issue?.key, issue],
	);

const dateToFolderConvert = (date: Date): string => {
	const pad = (n: number) => (n < 10 ? `0${n}` : n);
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
		date.getUTCDate(),
	)}`;
};

/** today as folder given */
export const todayAsFolder = (): string =>
	dateToFolderConvert(londonTimeAsDate());

export const todayAsKey = async (): Promise<string> => {
	const edition = await getSelectedEditionSlug();
	return `${edition}/${todayAsFolder()}`;
};

export const lastNDays = (n: number): string[] => {
	return Array.from({ length: n }, (_, i) => {
		const d = londonTimeAsDate();
		d.setDate(d.getDate() - i);
		return dateToFolderConvert(d);
	});
};
