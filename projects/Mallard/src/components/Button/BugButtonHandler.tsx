import React, { useContext } from 'react';
import { AccessContext } from 'src/authentication/AccessContext';
import { createMailtoHandler } from 'src/helpers/diagnostics';
import { isInBeta } from 'src/helpers/release-stream';
import { DIAGNOSTICS_TITLE } from 'src/helpers/words';
import { useGdprSettings } from 'src/hooks/use-gdpr';
import { useNetInfo } from 'src/hooks/use-net-info-provider';
import { BugButton } from './BugButton';

const BugButtonHandler = () => {
	const { attempt } = useContext(AccessContext);
	const {
		isConnected,
		isPoorConnection,
		downloadBlocked,
		isInternetReachable,
		type,
	} = useNetInfo();
	const netInfo = {
		isConnected,
		isPoorConnection,
		downloadBlocked,
		isInternetReachable,
		type,
	};

	const {
		gdprAllowEssential,
		gdprAllowPerformance,
		gdprAllowFunctionality,
		gdprConsentVersion,
	} = useGdprSettings();
	const gdprSettings = {
		gdprAllowEssential,
		gdprAllowPerformance,
		gdprAllowFunctionality,
		gdprConsentVersion,
	};
	return isInBeta() ? (
		<BugButton
			onPress={createMailtoHandler(
				'Report a bug',
				'',
				attempt,
				netInfo,
				gdprSettings,
				DIAGNOSTICS_TITLE,
			)}
		/>
	) : null;
};

export { BugButtonHandler };
