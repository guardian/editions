import type { Issue } from 'src/common';
import { fetchIssue } from 'src/helpers/fetch';
import type { CachedOrPromise } from 'src/helpers/fetch/cached-or-promise';
import { withResponse } from 'src/helpers/response';
import { useCachedOrPromise } from './use-cached-or-promise';

const useIssueWithResponse = <T>(
	getter: CachedOrPromise<T>,
	deps: unknown[] = [],
) => withResponse<T>(useCachedOrPromise<T>(getter, deps));

export const useIssueResponse = (
	issue: {
		localIssueId: Issue['localId'];
		publishedIssueId: Issue['publishedId'];
	},
	forceAPIFetch = false,
) => {
	return useIssueWithResponse(
		fetchIssue(issue.localIssueId, issue.publishedIssueId, forceAPIFetch),
		[issue],
	);
};
