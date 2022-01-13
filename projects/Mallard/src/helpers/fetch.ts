import { deleteIssueFiles } from 'src/download-edition/clear-issues-and-editions';
import { defaultSettings } from './settings/defaults';
import { cacheClearCache } from './storage';

const fetchDeprecationWarning = async (): Promise<{
	android: string;
	ios: string;
}> => {
	const response = await fetch(defaultSettings.deprecationWarningUrl);
	return response.json();
};

const getCacheNumber = async (): Promise<{ cacheClear: string }> => {
	const response = await fetch(defaultSettings.cacheClearUrl);
	return response.json();
};

const fetchCacheClear = async (): Promise<boolean> => {
	try {
		const [cacheNumber, cacheNumberStorage] = await Promise.all([
			getCacheNumber(),
			cacheClearCache.get(),
		]);

		if (cacheNumberStorage === null) {
			// No data, so store it
			await cacheClearCache.set(cacheNumber.cacheClear);
			// Suggests that this is a new user, so carry on as normal
			return true;
		}

		if (cacheNumberStorage !== cacheNumber.cacheClear) {
			// Deletes downloaded issues and the cache clear - login and GDPR settings need to be kept
			await deleteIssueFiles();
			await cacheClearCache.reset();
			// Server number doesnt match, which means we are making an attempt to clear the cache.
			return false;
		}

		// Cached number matches Remote number, so carry on as normal
		return true;
	} catch (e) {
		// Problems? Lets carry on with what we are doing.
		return true;
	}
};

export { fetchCacheClear, fetchDeprecationWarning };
