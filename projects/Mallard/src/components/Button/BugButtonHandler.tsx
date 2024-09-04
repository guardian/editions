import React, { useContext } from 'react';
import { AccessContext } from '../../authentication/AccessContext';
import { createMailtoHandler } from '../../helpers/diagnostics';
import { isInBeta } from '../../helpers/release-stream';
import { DIAGNOSTICS_TITLE } from '../../helpers/words';
import { useGdprSettings } from '../../hooks/use-gdpr';
import { useNetInfo } from '../../hooks/use-net-info-provider';
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

	const { gdprAllowEssential, gdprAllowPerformance, gdprConsentVersion } =
		useGdprSettings();
	const gdprSettings = {
		gdprAllowEssential,
		gdprAllowPerformance,
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
