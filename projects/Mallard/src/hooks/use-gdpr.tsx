import React, { createContext, useContext, useEffect, useState } from 'react';
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
 */
const CURRENT_CONSENT_VERSION = 7;

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

interface GdprSettings extends GdprCoreSettings {
	gdprAllowOphan: GdprSwitchSetting;
	gdprAllowSentry: GdprSwitchSetting;
	gdprAllowFacebookLogin: GdprSwitchSetting;
	gdprAllowGoogleLogin: GdprSwitchSetting;
	gdprAllowAppleLogin: GdprSwitchSetting;
	setGdprFunctionalityBucket: (setting: GdprSwitchSetting) => void;
	setGdprPerformanceBucket: (setting: GdprSwitchSetting) => void;
	enableAllSettings: () => void;
	resetAllSettings: () => void;
	hasSetGdpr: () => boolean;
	isCorrectConsentVersion: () => boolean;
	loading: boolean;
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
	gdprAllowOphan: true, // 'essential' so defaults to true and not switchable
	gdprAllowSentry: null,
	gdprAllowFacebookLogin: null,
	gdprAllowGoogleLogin: null,
	gdprAllowAppleLogin: null,
	setGdprFunctionalityBucket: () => {},
	setGdprPerformanceBucket: () => {},
	enableAllSettings: () => {},
	resetAllSettings: () => {},
	hasSetGdpr: () => false,
	isCorrectConsentVersion: () => false,
	loading: true,
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
	const [gdprAllowOphan, setGdprAllowOphan] = useState<
		GdprSettings['gdprAllowOphan']
	>(defaultState.gdprAllowOphan);
	const [gdprAllowSentry, setGdprAllowSentry] = useState<
		GdprSettings['gdprAllowSentry']
	>(defaultState.gdprAllowSentry);
	const [gdprAllowFacebookLogin, setGdprAllowFacebookLogin] = useState<
		GdprSettings['gdprAllowFacebookLogin']
	>(defaultState.gdprAllowFacebookLogin);
	const [gdprAllowGoogleLogin, setGdprAllowGoogleLogin] = useState<
		GdprSettings['gdprAllowGoogleLogin']
	>(defaultState.gdprAllowGoogleLogin);
	const [gdprAllowAppleLogin, setGdprAllowAppleLogin] = useState<
		GdprSettings['gdprAllowAppleLogin']
	>(defaultState.gdprAllowAppleLogin);

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

	const hasSetGdpr = () =>
		!loading &&
		gdprAllowFunctionality != null &&
		gdprAllowPerformance != null &&
		gdprConsentVersion === CURRENT_CONSENT_VERSION;

	const setGdprPerformanceBucket = (setting: GdprSwitchSetting) => {
		// Local state modifier
		setGdprAllowPerformance(setting);
		setGdprAllowSentry(setting);
		setGdprConsentVersion(CURRENT_CONSENT_VERSION);
		// Persisted state modifier
		setting === null
			? gdprAllowPerformanceCache.reset()
			: gdprAllowPerformanceCache.set(setting);
		gdprConsentVersionCache.set(CURRENT_CONSENT_VERSION);
	};

	const setGdprFunctionalityBucket = (setting: GdprSwitchSetting) => {
		// Local state modifier
		setGdprAllowFunctionality(setting);
		setGdprAllowGoogleLogin(setting);
		setGdprAllowFacebookLogin(setting);
		setGdprAllowAppleLogin(setting);
		setGdprConsentVersion(CURRENT_CONSENT_VERSION);
		// Persisted state modifier
		setting === null
			? gdprAllowFunctionalityCache.reset()
			: gdprAllowFunctionalityCache.set(setting);
		gdprConsentVersionCache.set(CURRENT_CONSENT_VERSION);
	};

	const enableAllSettings = () => {
		// Local state modifier
		setGdprAllowPerformance(true);
		setGdprAllowFunctionality(true);
		setGdprConsentVersion(CURRENT_CONSENT_VERSION);
		setGdprAllowOphan(true);
		setGdprAllowSentry(true);
		setGdprAllowFacebookLogin(true);
		setGdprAllowGoogleLogin(true);
		setGdprAllowAppleLogin(true);
		// Persisted state modifier
		gdprAllowPerformanceCache.set(true);
		gdprAllowFunctionalityCache.set(true);
		gdprConsentVersionCache.set(CURRENT_CONSENT_VERSION);
	};

	const resetAllSettings = () => {
		// Local state modifier
		setGdprAllowPerformance(defaultState.gdprAllowPerformance);
		setGdprAllowFunctionality(defaultState.gdprAllowFunctionality);
		setGdprConsentVersion(defaultState.gdprConsentVersion);
		setGdprAllowOphan(defaultState.gdprAllowOphan);
		setGdprAllowSentry(defaultState.gdprAllowSentry);
		setGdprAllowFacebookLogin(defaultState.gdprAllowFacebookLogin);
		setGdprAllowGoogleLogin(defaultState.gdprAllowGoogleLogin);
		setGdprAllowAppleLogin(defaultState.gdprAllowAppleLogin);
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
				resetAllSettings,
				hasSetGdpr,
				isCorrectConsentVersion,
				// The following are not used anywhere as things stand and are therefore not persisted
				gdprAllowOphan,
				gdprAllowSentry,
				gdprAllowFacebookLogin,
				gdprAllowGoogleLogin,
				gdprAllowAppleLogin,
				loading,
			}}
		>
			{children}
		</GDPRContext.Provider>
	);
};

export const useGdprSettings = () => useContext(GDPRContext);
