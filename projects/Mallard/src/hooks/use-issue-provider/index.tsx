import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Front, Issue, IssueWithFronts } from 'src/common';
import { isIssueOnDevice, readFileAsJSON } from 'src/helpers/files';
import { APIPaths, FSPaths } from 'src/paths';
import type { PathToIssue } from 'src/paths';
import { errorService } from 'src/services/errors';
import { useAppState } from '../use-app-state-provider';
import { useApiUrl } from '../use-config-provider';
import { useEditions } from '../use-edition-provider';
import { useIssueSummary } from '../use-issue-summary-provider';

const EMPTY_ISSUE_ID = { localIssueId: '', publishedIssueId: '' };
interface IssueState {
	issueWithFronts: IssueWithFronts | null;
	setIssueId: Dispatch<SetStateAction<PathToIssue>>;
	issueId: PathToIssue;
	error: string;
}

const initialState: IssueState = {
	issueWithFronts: null,
	setIssueId: () => {},
	issueId: EMPTY_ISSUE_ID,
	error: '',
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

export const IssueProvider = ({ children }: { children: React.ReactNode }) => {
	const { apiUrl } = useApiUrl();
	const { issueId: globalIssueId } = useIssueSummary();
	// A change in the selected edition should require a fetch of the latest issue
	const { selectedEdition } = useEditions();
	const { isActive } = useAppState();

	const [issueWithFronts, setIssueWithFronts] =
		useState<IssueState['issueWithFronts']>(null);
	const [issueId, setIssueId] = useState<IssueState['issueId']>(
		globalIssueId ?? EMPTY_ISSUE_ID,
	);
	const [error, setError] = useState<IssueState['error']>(initialState.error);

	const fetchIssue = useCallback(
		async (forceApiRefresh = false) => {
			const { localIssueId, publishedIssueId } = issueId;
			if (localIssueId && publishedIssueId) {
				if (forceApiRefresh) {
					return await fetchIssueWithFrontsFromAPI(
						publishedIssueId,
						apiUrl,
					);
				}

				const issueOnDevice = await isIssueOnDevice(localIssueId);
				if (issueOnDevice) {
					return await fetchIssueWithFrontsFromFS(localIssueId);
				}

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
		fetchIssue()
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
		if (isActive) {
			fetchIssue(true).catch((e) => errorService.captureException(e));
		}
	}, [isActive]);

	return (
		<IssueContext.Provider
			value={{
				issueWithFronts,
				setIssueId,
				issueId,
				error,
			}}
		>
			{children}
		</IssueContext.Provider>
	);
};

export const useIssue = () => useContext(IssueContext);
