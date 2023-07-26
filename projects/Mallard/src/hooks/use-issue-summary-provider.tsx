import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { Dispatch } from 'react';
import type { IssueSummary } from 'src/common';
import { fetchAndStoreIssueSummary, readIssueSummary } from 'src/helpers/files';
import type { PathToIssue } from 'src/paths';
import { errorService } from 'src/services/errors';
import { useAppState } from './use-app-state-provider';
import {
	getMaxAvailableEditions,
	useMaxAvailableEditions,
} from './use-config-provider';
import { useEditions } from './use-edition-provider';
import { useNetInfo } from './use-net-info-provider';

interface IssueSummaryState {
	issueSummary: IssueSummary[] | null;
	issueId: PathToIssue | null;
	error: string;
	initialFrontKey: string | null;
	setIssueId: Dispatch<PathToIssue>;
	getLatestIssueSummary: () => Promise<void>;
}

const defaultState: IssueSummaryState = {
	issueSummary: null,
	issueId: null,
	error: '',
	initialFrontKey: null,
	setIssueId: () => {},
	getLatestIssueSummary: () => Promise.resolve(),
};

const IssueSummaryContext = createContext(defaultState);

export const getIssueSummary = async (
	isConnected = true,
	isPoorConnection = false,
): Promise<IssueSummary[]> => {
	const issueSummary =
		isConnected && !isPoorConnection
			? await fetchAndStoreIssueSummary()
			: await readIssueSummary();
	const maxAvailableEditions = await getMaxAvailableEditions();
	try {
		const trimmedSummary = issueSummary.slice(0, maxAvailableEditions);
		return trimmedSummary;
	} catch (e: any) {
		e.message = `getIssueSummary error: maxAvailableEditions: ${maxAvailableEditions} & issueSummary: ${JSON.stringify(
			issueSummary,
		)}`;
		errorService.captureException(e);
		throw Error(e);
	}
};

export const issueSummaryToLatestPath = (
	issueSummary: IssueSummary[],
): PathToIssue => ({
	localIssueId: issueSummary[0].localId,
	publishedIssueId: issueSummary[0].publishedId,
});

export const IssueSummaryProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [issueSummary, setIssueSummary] = useState<
		IssueSummaryState['issueSummary']
	>(defaultState.issueSummary);
	const [issueId, setLocalIssueId] = useState<IssueSummaryState['issueId']>(
		defaultState.issueId,
	);
	const [initialFrontKey, setInitialFrontKey] = useState<
		IssueSummaryState['initialFrontKey']
	>(defaultState.initialFrontKey);
	const [error, setError] = useState<IssueSummaryState['error']>(
		defaultState.error,
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { isConnected, isPoorConnection } = useNetInfo();
	const { selectedEdition } = useEditions();
	const { maxAvailableEditions } = useMaxAvailableEditions();
	const { isActive } = useAppState();

	const setIssueId = useCallback(
		(issueId: PathToIssue, frontKey?: string) => {
			frontKey && setInitialFrontKey(frontKey);
			setLocalIssueId(issueId);
		},
		[setInitialFrontKey, setLocalIssueId],
	);

	// Use Callback used so the function isnt recreated on each rerender
	// @TODO: Look to move this logic outside of the provider so it can be tested
	const getLatestIssueSummary = useCallback(
		(skipSetting?: boolean) => {
			return getIssueSummary(isConnected, isPoorConnection)
				.then((retrievedIssueSummary) => {
					setIssueSummary(retrievedIssueSummary);
					if (skipSetting) {
						return;
					}

					// Clear the initial front key if it is a new issue id and set it
					const latestIssueId = issueSummaryToLatestPath(
						retrievedIssueSummary,
					);

					const previousIssue =
						issueSummary && issueSummaryToLatestPath(issueSummary);

					if (
						issueId === null ||
						!previousIssue ||
						(previousIssue.localIssueId !==
							latestIssueId.localIssueId &&
							previousIssue.publishedIssueId !==
								latestIssueId.publishedIssueId)
					) {
						setInitialFrontKey(null);
						setLocalIssueId(latestIssueId);
					}
					setError('');
				})
				.catch((e) => {
					setError(e.message);
					// In the case of error, attempt to get the last stored issue summary
					getIssueSummary(false)
						.then((backupIssueSummary) => {
							setIssueSummary(backupIssueSummary);
							const backupIssueIds =
								issueSummaryToLatestPath(backupIssueSummary);
							setIssueId(backupIssueIds);
						})
						.catch((e) => {
							e.message = `Unable to get backup issue summary: ${e.message}`;
							errorService.captureException(e);
						});
				});
		},
		[
			isConnected,
			isPoorConnection,
			selectedEdition.edition,
			maxAvailableEditions,
		],
	);

	// On load, get the latest issue summary
	useEffect(() => {
		getLatestIssueSummary();
	}, []);

	// When the network status, max available editions or app state changes
	useEffect(() => {
		if (isActive && !isLoading) {
			setIsLoading(true);
			getLatestIssueSummary(true).finally(() => setIsLoading(false));
		}
	}, [isConnected, isPoorConnection, maxAvailableEditions, isActive]);

	// Force getting the latest issue summary when an edition changes
	useEffect(() => {
		getLatestIssueSummary();
	}, [selectedEdition.edition]);

	return (
		<IssueSummaryContext.Provider
			value={{
				issueSummary,
				issueId,
				setIssueId,
				initialFrontKey,
				error,
				getLatestIssueSummary,
			}}
		>
			{children}
		</IssueSummaryContext.Provider>
	);
};

export const useIssueSummary = () => useContext(IssueSummaryContext);
