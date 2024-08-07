import type { Dispatch } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
	EditionsList,
	RegionalEdition,
	SpecialEdition,
	SpecialEditionHeaderStyles,
} from '../common';
import { defaultRegionalEditions, getEditionIds } from '../common';
import { isLondonTimeBefore } from '../helpers/date';
import {
	defaultSettings,
	editionsEndpoint,
} from '../helpers/settings/defaults';
import {
	defaultEditionCache,
	editionsListCache,
	seenEditionsCache,
	selectedEditionCache,
	showAllEditionsCache,
} from '../helpers/storage';
import { weatherHider } from '../helpers/weather-hider';
import { pushNotificationRegistration } from '../notifications/push-notifications';
import { errorService } from '../services/errors';
import { useAppState } from './use-app-state-provider';
import { useApiUrl } from './use-config-provider';
import type { NetInfoState } from './use-net-info-provider';
import { useNetInfo } from './use-net-info-provider';
import type { IsWeatherShown } from './use-weather-provider';
import { useIsWeatherShown } from './use-weather-provider';

interface EditionState {
	editionsList: EditionsList;
	selectedEdition: RegionalEdition | SpecialEdition;
	defaultEdition: RegionalEdition;
	showNewEditionCard: boolean;
	setShowNewEditionCard: (isShown: boolean) => void;
	setNewEditionSeen: () => void;
	storeSelectedEdition: (
		chosenEdition: RegionalEdition | SpecialEdition,
	) => void;
}

export const getSpecialEditionProps = (
	edition: RegionalEdition | SpecialEdition,
): { headerStyle?: SpecialEditionHeaderStyles } | undefined => {
	return edition.editionType === 'Special'
		? (edition as SpecialEdition)
		: undefined;
};

export const DEFAULT_EDITIONS_LIST = {
	regionalEditions: defaultRegionalEditions,
	specialEditions: [],
	trainingEditions: [],
};

export const BASE_EDITION = defaultRegionalEditions[0];

const defaultState: EditionState = {
	editionsList: DEFAULT_EDITIONS_LIST,
	selectedEdition: BASE_EDITION, // the current chosen edition
	defaultEdition: BASE_EDITION, // the edition to show on app start
	showNewEditionCard: false,
	setShowNewEditionCard: () => {},
	setNewEditionSeen: () => {},
	storeSelectedEdition: () => {},
};

const EditionContext = createContext(defaultState);

const getSelectedEdition = async () => {
	try {
		const selected = await selectedEditionCache.get();
		const editionsList = await editionsListCache.get();
		const editionIds = editionsList ? getEditionIds(editionsList) : [];

		return selected && editionIds.includes(selected.edition)
			? selected
			: null;
	} catch {
		return null;
	}
};

export const getSelectedEditionSlug = async () => {
	const edition = await getSelectedEdition();
	return edition ? edition.edition : BASE_EDITION.edition;
};

// Exported for testing, only use internally to maintain local and async state
export const getDefaultEdition = async () => {
	try {
		return await defaultEditionCache.get();
	} catch {
		return null;
	}
};

export const getDefaultEditionSlug = async () => {
	const defaultEdition = await getDefaultEdition();
	return defaultEdition ? defaultEdition.edition : null;
};

export const fetchEditions = async (
	apiUrl: string,
): Promise<EditionsList | null> => {
	try {
		const response = await fetch(apiUrl, {
			headers: {
				'Content-Type': 'application/json',
				'cache-control': 'max-age=300',
			},
		});
		if (response.status !== 200) {
			throw new Error(
				`Bad response from Editions URL - status: ${response.status}`,
			);
		}
		const json = await response.json();
		return json;
	} catch (e: any) {
		e.message = `Unable to fetch ${apiUrl} : ${e.message}`;
		errorService.captureException(e);
		return null;
	}
};

export const removeExpiredSpecialEditions = (
	editionsList: EditionsList,
): EditionsList => {
	return {
		...editionsList,
		specialEditions: editionsList.specialEditions.filter((e) =>
			isLondonTimeBefore(new Date(e.expiry)),
		),
	};
};

export const getEditions = async (
	isConnected: boolean,
	apiUrl: string = defaultSettings.editionsUrl,
) => {
	try {
		// We are connected
		if (isConnected) {
			// Grab editions list from the endpoint
			const editionsList = await fetchEditions(apiUrl);
			if (editionsList) {
				const showAllEditions = await showAllEditionsCache.get();
				const filteredList = showAllEditions
					? editionsList
					: removeExpiredSpecialEditions(editionsList);
				// Successful? Store in the cache and return
				await editionsListCache.set(filteredList);
				return filteredList;
			}
			// Unsuccessful, try getting it from our local storage
			const cachedEditionsList = await editionsListCache.get();
			if (cachedEditionsList) {
				return cachedEditionsList;
			}
			// Not in local storage either?
			throw new Error('Unable to Get Editions');
		}
		// Not connected? Try local storage
		const cachedEditionsList = await editionsListCache.get();
		if (cachedEditionsList) {
			return cachedEditionsList;
		}
		// Not in local storage either?
		throw new Error('Unable to Get Editions');
	} catch (e) {
		errorService.captureException(e);
		return DEFAULT_EDITIONS_LIST;
	}
};

const setEdition = async (
	edition: RegionalEdition,
	setDefaultEdition: Dispatch<RegionalEdition>,
	setSelectedEdition: Dispatch<RegionalEdition | SpecialEdition>,
	downloadBlocked: NetInfoState['downloadBlocked'],
	setIsWeatherShown: IsWeatherShown['setIsWeatherShown'],
) => {
	setDefaultEdition(edition);
	setSelectedEdition(edition);
	await selectedEditionCache.set(edition);
	await defaultEditionCache.set(edition);
	await weatherHider(setIsWeatherShown);
	pushNotificationRegistration(downloadBlocked);
};

export const defaultEditionDecider = async (
	setDefaultEdition: Dispatch<RegionalEdition>,
	setSelectedEdition: Dispatch<RegionalEdition | SpecialEdition>,
	downloadBlocked: NetInfoState['downloadBlocked'],
	setIsWeatherShown: IsWeatherShown['setIsWeatherShown'],
): Promise<void> => {
	const selectedEdition = await getSelectedEdition();
	// When user already has default edition set then that edition
	const defaultEdition = await getDefaultEdition();

	// if user has already selected an edition, use that one
	if (selectedEdition) {
		setSelectedEdition(selectedEdition);
	} else if (defaultEdition) {
		setDefaultEdition(defaultEdition);
		setSelectedEdition(defaultEdition);
		await selectedEditionCache.set(defaultEdition);
		pushNotificationRegistration(downloadBlocked);
	} else {
		// otherwise, set default edition
		await setEdition(
			BASE_EDITION,
			setDefaultEdition,
			setSelectedEdition,
			downloadBlocked,
			setIsWeatherShown,
		);
	}
};

/**
 * This filter is a temporary solution to hide the Australian edition from the list
 * Currentnly, the editions list is populated by the /editions endpoint, which in turn
 * is populated by an S3 bucket. To remove the Australian edition, it should be removed from
 * thge S3 bucket.
 */

const temporaryFilterEditionsList = (
	editionsList: EditionsList,
): EditionsList => {
	const filteredRegionalEditions = editionsList.regionalEditions.filter(
		(e) => e.edition !== 'australian-edition',
	);
	return {
		...editionsList,
		regionalEditions: filteredRegionalEditions,
	};
};

export const EditionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [editionsList, setEditionsList] = useState<EditionsList>(
		DEFAULT_EDITIONS_LIST,
	);
	const [selectedEdition, setSelectedEdition] = useState<
		RegionalEdition | SpecialEdition
	>(BASE_EDITION);
	const [defaultEdition, setDefaultEdition] =
		useState<RegionalEdition>(BASE_EDITION);
	const [showNewEditionCard, setShowNewEditionCard] =
		useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { apiUrl } = useApiUrl();
	const { isConnected, downloadBlocked } = useNetInfo();
	const { isActive } = useAppState();
	const { setIsWeatherShown } = useIsWeatherShown();

	/**
	 * Default Edition and Selected
	 *
	 * On clean install the cache will be empty, therefore defaultRegionalEditions[0]
	 * (aka UK Daily) remains as the default until one is set. If found, we want to
	 * also set this as the selected edition
	 */
	useEffect(() => {
		defaultEditionDecider(
			setDefaultEdition,
			setSelectedEdition,
			downloadBlocked,
			setIsWeatherShown,
		);
	}, [editionsList, downloadBlocked]);

	/**
	 * List of Editions
	 *
	 * We grab the editions from the endpoint. If its not accessible, we use the default
	 * editions that are set in the initial state
	 */
	useEffect(() => {
		// Get the api url and then make network request to fetch edition list
		const fullUrl = editionsEndpoint(apiUrl);

		// Avoid calling getEditions below by passing `apiUrl` state variable because that
		// doesn't get updated immediately, it only updates in next render.
		// Details can be found here: https://stackoverflow.com/questions/54069253/usestate-set-method-not-reflecting-change-immediately
		if (!isLoading) {
			setIsLoading(true);
			getEditions(isConnected, fullUrl)
				.then((ed) => {
					if (ed) {
						const removeAus = temporaryFilterEditionsList(ed);
						setEditionsList(removeAus);
					}
				})
				.finally(() => setIsLoading(false));
		}
	}, []);

	/**
	 * If a chosen edition is regional, then we mark that as default for future reference
	 */
	const storeSelectedEdition = async (
		chosenEdition: RegionalEdition | SpecialEdition,
	) => {
		await selectedEditionCache.set(chosenEdition);
		setSelectedEdition(chosenEdition);
		if (chosenEdition.editionType === 'Regional') {
			await defaultEditionCache.set(chosenEdition as RegionalEdition);
			setDefaultEdition(chosenEdition as RegionalEdition);
			pushNotificationRegistration(downloadBlocked);
		}
	};

	/**
	 * On App State change to foreground, or connection change, we want to check for a new editionsList
	 */
	useEffect(() => {
		if (isActive && !isLoading) {
			setIsLoading(true);
			const fullUrl = editionsEndpoint(apiUrl);
			getEditions(isConnected, fullUrl)
				.then((ed) => {
					if (ed) {
						const removeAus =
							temporaryFilterEditionsList(editionsList);
						setEditionsList(removeAus);
					}
				})
				.finally(() => setIsLoading(false));
		}
	}, [isConnected, isActive]);

	useEffect(() => {
		seenEditionsCache.get().then((seen) => {
			const unseenEditions = editionsList.specialEditions.filter(
				(e) => !seen || !seen?.includes(e.edition),
			);
			if (unseenEditions.length > 0) {
				setShowNewEditionCard(true);
			}
		});
	}, [editionsList.specialEditions]);

	const setNewEditionSeen = () => {
		if (!showNewEditionCard) return;
		seenEditionsCache.set(
			editionsList.specialEditions.map((e) => e.edition),
		);
		setShowNewEditionCard(false);
	};

	return (
		<EditionContext.Provider
			value={{
				editionsList,
				selectedEdition,
				defaultEdition,
				showNewEditionCard,
				storeSelectedEdition,
				setShowNewEditionCard,
				setNewEditionSeen,
			}}
		>
			{children}
		</EditionContext.Provider>
	);
};

export const useEditions = () => useContext(EditionContext);
