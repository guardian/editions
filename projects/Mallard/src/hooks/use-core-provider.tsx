import React from 'react';
import { useErrorService } from './use-error-service';
import { useIssueDownloads } from './use-issue-downloads';
import { useLogging } from './use-logging';

/**
 * Provider in name, but not in nature. This is a catch all for core level hooks that are not user specific
 */

export const CoreProvider = ({ children }: { children: React.ReactNode }) => {
	useErrorService();
	useIssueDownloads();
	useLogging();

	return <>{children}</>;
};
