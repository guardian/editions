import { useActionSheet } from '@expo/react-native-action-sheet';
import { useEffect, useState } from 'react';
import { rateApp } from '../helpers/rate';
import {
	hasShownRatingCache,
	numberOfInteractionsCache,
} from '../helpers/storage';
import { errorService } from '../services/errors';
import { remoteConfigService } from '../services/remote-config';

const getFromStorage = async (
	storage: any,
	initialState: any,
): Promise<any> => {
	try {
		const value = await storage.get();
		return value ?? initialState;
	} catch {
		return Promise.resolve(initialState);
	}
};

export const INTERACTIONS_THRESHOLD = 50;

export const useRating = () => {
	const [numberOfInteractions, setNumberOfInteractions] = useState<number>(0);
	const [hasShownRating, setHasShownRating] = useState<boolean>(true);
	const { showActionSheetWithOptions } = useActionSheet();

	useEffect(() => {
		getFromStorage(numberOfInteractionsCache, 0)
			.then((numberOfInteractions) =>
				setNumberOfInteractions(numberOfInteractions),
			)
			.catch((e) => {
				errorService.captureException(e);
			});
	}, []);
	useEffect(() => {
		getFromStorage(hasShownRatingCache, 0)
			.then((hasShownRating) => setHasShownRating(hasShownRating))
			.catch((e) => {
				errorService.captureException(e);
			});
	}, []);

	const setInteractions = (num: number) => {
		setNumberOfInteractions(num);
		numberOfInteractionsCache.set(num);
	};

	const setShowRating = (show: boolean) => {
		setHasShownRating(show);
		hasShownRatingCache.set(show);
	};

	const callbacks = [
		() => {
			setHasShownRating(true);
			hasShownRatingCache.set(true);
			rateApp();
		},
		() => remindMeLater(),
		() => dontShowAgain(),
	];

	const rateUserFlow = () => {
		showActionSheetWithOptions(
			{
				options: ['Rate now', 'Remind me later', "Don't ask again"],
				title: 'We want to know your thoughts',
				destructiveButtonIndex: 2,
			},
			(index) => {
				index !== undefined && callbacks[index]();
			},
		);
	};

	const interaction = () => {
		// Remote Feature flag check to see if we can log an interaction
		const isRatingOn = remoteConfigService.getBoolean('rating');

		if (hasShownRating || !isRatingOn) {
			return;
		}

		const bumpInteractions = numberOfInteractions + 1;
		setInteractions(bumpInteractions);

		if (bumpInteractions > INTERACTIONS_THRESHOLD) {
			// Clear all in case someone clicks outside of the action sheet so we dont ask every interaction
			clearAll();
			rateUserFlow();
		}
	};

	// Clears the number of interactions so the process starts again
	const remindMeLater = () => {
		setInteractions(0);
	};

	// Stops the user from adding interactions and therefore seeing the action sheet
	const dontShowAgain = () => {
		setShowRating(true);
	};

	// Used in dev-zone testing only
	const clearAll = () => {
		setInteractions(0);
		setShowRating(false);
	};

	return {
		interaction,
		rateUserFlow,
		hasShownRating,
		// The following is exported for dev zone only
		numberOfInteractions,
		clearAll,
	};
};
