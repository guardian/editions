import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type {
	CAPIArticle,
	Collection,
	Front,
	Issue,
	IssueWithFronts,
} from 'src/common';
import { isIssueOnDevice, readFileAsJSON } from 'src/helpers/files';
import {
	flattenCollectionsToCards,
	flattenFlatCardsToFront,
} from 'src/helpers/transform';
import { ERR_404_REMOTE } from 'src/helpers/words';
import { APIPaths, FSPaths } from 'src/paths';
import type { PathToArticle, PathToIssue } from 'src/paths';
import { errorService } from 'src/services/errors';
import type { IssueOrigin } from '../../../../Apps/common/src';
import { useAppState } from '../use-app-state-provider';
import { useApiUrl } from '../use-config-provider';
import { useEditions } from '../use-edition-provider';
import { useIssueSummary } from '../use-issue-summary-provider';

type ArticleProps = Omit<
	PathToArticle,
	'localIssueId' | 'publishedIssueId' | 'collection'
>;
type ArticleContent = {
	article: CAPIArticle;
	collection: Collection;
	origin: IssueOrigin;
};

const EMPTY_ISSUE_ID = { localIssueId: '', publishedIssueId: '' };
interface IssueState {
	issueWithFronts: IssueWithFronts | null;
	setIssueId: Dispatch<SetStateAction<PathToIssue>>;
	issueId: PathToIssue;
	error: string;
	getArticle: (props: ArticleProps) => ArticleContent | null;
	retry: () => void;
}

const initialState: IssueState = {
	issueWithFronts: null,
	setIssueId: () => {},
	issueId: EMPTY_ISSUE_ID,
	error: '',
	getArticle: () => null,
	retry: () => {},
};

const IssueContext = createContext(initialState);

const fetchIssueWithFrontsFromAPI = async (
	id: string,
	apiUrl: string,
): Promise<IssueWithFronts> => {
	const issue: Issue = await fetch(`${apiUrl}${APIPaths.issue(id)}`).then(
		(res) => {
			if (res.status !== 200) {
				throw new Error(`Failed to fetch from issues api endpoint`);
			}
			return res.json();
		},
	);
	const fronts: Front[] = await Promise.all(
		issue.fronts.map((frontId) =>
			fetch(`${apiUrl}${APIPaths.front(id, frontId)}`).then((res) => {
				if (res.status !== 200) {
					throw new Error(
						'Failed to fetch the fronts from issues apt endpoint',
					);
				}
				return res.json();
			}),
		),
	);
	return {
		...issue,
		origin: 'api',
		fronts,
	};
};

const fetchIssueWithFrontsFromFS = async (
	id: string,
): Promise<IssueWithFronts> => {
	const issue = await readFileAsJSON<Issue>(FSPaths.issue(id));
	const fronts = await Promise.all(
		issue.fronts.map((frontId) =>
			readFileAsJSON<Front>(FSPaths.front(id, frontId)),
		),
	);
	return {
		...issue,
		origin: 'filesystem',
		fronts,
	};
};

export const fetchIssue = async (issueId: PathToIssue, apiUrl: string) => {
	const { localIssueId, publishedIssueId } = issueId;
	if (localIssueId && publishedIssueId) {
		const issueOnDevice = await isIssueOnDevice(localIssueId);
		if (issueOnDevice) {
			return await fetchIssueWithFrontsFromFS(localIssueId);
		}

		return await fetchIssueWithFrontsFromAPI(publishedIssueId, apiUrl);
	}
};

export const IssueProvider = ({ children }: { children: React.ReactNode }) => {
	const { apiUrl } = useApiUrl();
	const { issueId: globalIssueId } = useIssueSummary();
	// A change in the selected edition should require a fetch of the latest issue
	const { selectedEdition } = useEditions();
	const { isActive } = useAppState();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [issueWithFronts, setIssueWithFronts] =
		useState<IssueState['issueWithFronts']>(null);
	const [issueId, setIssueId] = useState<IssueState['issueId']>(
		globalIssueId ?? EMPTY_ISSUE_ID,
	);
	const [error, setError] = useState<IssueState['error']>(initialState.error);

	const getIssue = useCallback(
		async (forceApiRefresh = false) => {
			const { localIssueId, publishedIssueId } = issueId;
			if (localIssueId && publishedIssueId) {
				setIsLoading(true);
				if (forceApiRefresh) {
					setIsLoading(false);
					return await fetchIssueWithFrontsFromAPI(
						publishedIssueId,
						apiUrl,
					);
				}

				const issueOnDevice = await isIssueOnDevice(localIssueId);
				if (issueOnDevice) {
					setIsLoading(false);
					return await fetchIssueWithFrontsFromFS(localIssueId);
				}

				setIsLoading(false);
				return await fetchIssueWithFrontsFromAPI(
					publishedIssueId,
					apiUrl,
				);
			}
		},
		[apiUrl, issueId],
	);

	useEffect(() => {
		globalIssueId && setIssueId(globalIssueId);
	}, [globalIssueId]);

	useEffect(() => {
		!isLoading &&
			getIssue()
				.then((issue) => {
					issue && setIssueWithFronts(issue);
					setError('');
				})
				.catch((e) => {
					errorService.captureException(e);
					setError('Unable to get issue, please try again later');
				});
	}, [issueId, apiUrl, selectedEdition]);

	// When the app state returns, we fore grab the latest issue from the API
	// But we dont save it to our local state. This means we have a fresh copy but dont update the user experience
	useEffect(() => {
		if (isActive && !isLoading) {
			getIssue(true).catch((e) => errorService.captureException(e));
		}
	}, [isActive]);

	const getArticle = ({
		article,
		front,
	}: Omit<
		PathToArticle,
		'localIssueId' | 'publishedIssueId' | 'collection'
	>) => {
		if (!issueWithFronts) {
			setError(ERR_404_REMOTE);
			return null;
		}
		const maybeFront = issueWithFronts.fronts.find((f) => f.key === front);
		if (!maybeFront) {
			setError(ERR_404_REMOTE);
			return null;
		}

		const allArticles = flattenFlatCardsToFront(
			flattenCollectionsToCards(maybeFront.collections),
		);
		const articleContent = allArticles.find(
			({ article: { key } }) => key === article,
		);

		if (articleContent) {
			return { ...articleContent, origin: issueWithFronts.origin };
		}

		setError(ERR_404_REMOTE);
		return null;
	};

	const retry = () => {
		getIssue(true)
			.then((issue) => {
				issue && setIssueWithFronts(issue);
				setError('');
			})
			.catch((e) => {
				errorService.captureException(e);
				setError('Unable to get issue, please try again later');
			});
	};

	return (
		<IssueContext.Provider
			value={{
				issueWithFronts,
				setIssueId,
				issueId,
				error,
				getArticle,
				retry,
			}}
		>
			{children}
		</IssueContext.Provider>
	);
};

export const useIssue = () => useContext(IssueContext);
