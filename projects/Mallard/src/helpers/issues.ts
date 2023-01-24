import { getDate, getDay, getMonth } from 'date-fns';
import { useMemo } from 'react';
import type { Issue } from 'src/common';
import { getSelectedEditionSlug } from 'src/hooks/use-edition-provider';
import { londonTime } from './date';

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const days = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

interface IssueDate {
	date: string;
	weekday: string;
}

export const renderIssueDate = (dateString: Issue['date']): IssueDate => {
	const date = londonTime(dateString);
	return {
		date: `${getDate(date)} ${months[getMonth(date)]}`,
		weekday: days[getDay(date)],
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
export const todayAsFolder = (): string => dateToFolderConvert(londonTime());

export const todayAsKey = async (): Promise<string> => {
	const edition = await getSelectedEditionSlug();
	return `${edition}/${todayAsFolder()}`;
};

export const lastNDays = (n: number): string[] => {
	return Array.from({ length: n }, (_, i) => {
		const d = londonTime();
		d.setDate(d.getDate() - i);
		return dateToFolderConvert(d);
	});
};
