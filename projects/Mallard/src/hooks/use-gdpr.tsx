import React, { createContext, useContext, useEffect, useState } from 'react';
import { toggleAnalyticsRecording } from 'src/helpers/analytics';
import {
	gdprAllowFunctionalityCache,
	gdprAllowPerformanceCache,
	gdprConsentVersionCache,
} from 'src/helpers/storage';
import { errorService } from 'src/services/errors';

/**
 * History of Consent Management
 *
 * v1 - The initial version that CMP was released with
 * v2 - Move Braze from ESSENTIAL to PERSONALISED_ADS
 * v3 - Add Logging to PERFORMANCE
 * v4 - Add Apple in FUNCTIONALITY
 * v5 - Add Firebase in ESSENTIAL
 * v6 - Add Crashlytics in PERFORMANCE, update wording in ESSENTIAL
 * v7 - Remove Braze from wording in ESSENTIAL
 * v8 - Add Firebase Analytics as PERFORMANCE
 * v9 - Remove additional Logging
 * v10 - Remove Sentry from the app
 */
const CURRENT_CONSENT_VERSION = 10;

/*
Consent switches can be 'unset' or null
*/
export type GdprSwitchSetting = null | boolean;

export type GdprCoreSettings = {
	gdprAllowEssential: GdprSwitchSetting;
	gdprAllowPerformance: GdprSwitchSetting;
	gdprAllowFunctionality: GdprSwitchSetting;
	gdprConsentVersion: number | null;
};

export enum OnboardingStatus {
	NotStarted = 'NotStarted',
	InProgress = 'InProgress',
	Complete = 'Complete',
	Unknown = 'Unknown',
}

interface GdprSettings extends GdprCoreSettings {
	setGdprFunctionalityBucket: (setting: GdprSwitchSetting) => void;
	setGdprPerformanceBucket: (setting: GdprSwitchSetting) => void;
	enableAllSettings: () => void;
	rejectAllSettings: () => void;
	resetAllSettings: () => void;
	hasSetGdpr: () => OnboardingStatus;
	isCorrectConsentVersion: () => boolean;
}

export type GdprSwitches = {
	gdprAllowPerformance: GdprSettings['gdprAllowPerformance'];
	gdprAllowFunctionality: GdprSettings['gdprAllowFunctionality'];
};

const defaultState: GdprSettings = {
	gdprAllowEssential: true, // essential defaults to true and not switchable
	gdprAllowPerformance: null,
	gdprAllowFunctionality: null,
	gdprConsentVersion: null,
	setGdprFunctionalityBucket: () => {},
	setGdprPerformanceBucket: () => {},
	enableAllSettings: () => {},
	rejectAllSettings: () => {},
	resetAllSettings: () => {},
	hasSetGdpr: () => OnboardingStatus.Unknown,
	isCorrectConsentVersion: () => false,
};

const GDPRContext = createContext<GdprSettings>(defaultState);

export const GDPRProvider = ({ children }: { children: React.ReactNode }) => {
	const [gdprAllowPerformance, setGdprAllowPerformance] = useState<
		GdprSettings['gdprAllowPerformance']
	>(defaultState.gdprAllowPerformance);
	const [gdprAllowFunctionality, setGdprAllowFunctionality] = useState<
		GdprSettings['gdprAllowFunctionality']
	>(defaultState.gdprAllowFunctionality);
	const [gdprConsentVersion, setGdprConsentVersion] = useState<
		GdprSettings['gdprConsentVersion']
	>(defaultState.gdprConsentVersion);

	const [loading, setLoading] = useState<boolean>(true);

	// On mount, grab the persisted state values
	useEffect(() => {
		Promise.all([
			gdprAllowPerformanceCache
				.get()
				.then((val) => setGdprAllowPerformance(val))
				.catch((e) => errorService.captureException(e)),
			gdprConsentVersionCache
				.get()
				.then((val) => setGdprConsentVersion(val))
				.catch((e) => errorService.captureException(e)),
			gdprAllowFunctionalityCache
				.get()
				.then((val) => setGdprAllowFunctionality(val))
				.catch((e) => errorService.captureException(e)),
		]).finally(() => setLoading(false));
	}, []);

	const hasSetGdpr = () => {
		if (!loading) {
			if (
				gdprAllowFunctionality != null &&
				gdprAllowPerformance != null &&
				gdprConsentVersion === CURRENT_CONSENT_VERSION
			) {
				return OnboardingStatus.Complete;
			}

			if (
				gdprAllowFunctionality != null ||
				gdprAllowPerformance != null
			) {
				return OnboardingStatus.InProgress;
			}

			return OnboardingStatus.NotStarted;
		}
		return OnboardingStatus.Unknown;
	};

	const setGdprPerformanceBucket = (setting: GdprSwitchSetting) => {
		// Local state modifier
		setGdprAllowPerformance(setting);
		setGdprConsentVersion(CURRENT_CONSENT_VERSION);
		setting
			? toggleAnalyticsRecording(setting)
			: toggleAnalyticsRecording(false);
		// Persisted state modifier
		setting === null
			? gdprAllowPerformanceCache.reset()
			: gdprAllowPerformanceCache.set(setting);
		gdprConsentVersionCache.set(CURRENT_CONSENT_VERSION);
	};

	const setGdprFunctionalityBucket = (setting: GdprSwitchSetting) => {
		// Local state modifier
		setGdprAllowFunctionality(setting);
		setGdprConsentVersion(CURRENT_CONSENT_VERSION);
		// Persisted state modifier
		setting === null
			? gdprAllowFunctionalityCache.reset()
			: gdprAllowFunctionalityCache.set(setting);
		gdprConsentVersionCache.set(CURRENT_CONSENT_VERSION);
	};

	const allSettings = (modifier: boolean) => {
		// Local state modifier
		setGdprAllowPerformance(modifier);
		setGdprAllowFunctionality(modifier);
		setGdprConsentVersion(CURRENT_CONSENT_VERSION);
		// Persisted state modifier
		gdprAllowPerformanceCache.set(modifier);
		gdprAllowFunctionalityCache.set(modifier);
		gdprConsentVersionCache.set(CURRENT_CONSENT_VERSION);
	};

	const enableAllSettings = () => allSettings(true);

	const rejectAllSettings = () => allSettings(false);

	const resetAllSettings = () => {
		// Local state modifier
		setGdprAllowPerformance(defaultState.gdprAllowPerformance);
		setGdprAllowFunctionality(defaultState.gdprAllowFunctionality);
		setGdprConsentVersion(defaultState.gdprConsentVersion);
		// Persisted state modifier
		gdprAllowPerformanceCache.reset();
		gdprAllowFunctionalityCache.reset();
		gdprConsentVersionCache.reset();
	};

	const isCorrectConsentVersion = () =>
		gdprConsentVersion === CURRENT_CONSENT_VERSION;

	return (
		<GDPRContext.Provider
			value={{
				gdprAllowEssential: defaultState.gdprAllowEssential,
				gdprAllowPerformance,
				gdprAllowFunctionality,
				gdprConsentVersion,
				setGdprFunctionalityBucket,
				setGdprPerformanceBucket,
				enableAllSettings,
				rejectAllSettings,
				resetAllSettings,
				hasSetGdpr,
				isCorrectConsentVersion,
			}}
		>
			{children}
		</GDPRContext.Provider>
	);
};

export const useGdprSettings = () => useContext(GDPRContext);
