import React, { useContext } from 'react';
import { AccessContext } from 'src/authentication/AccessContext';
import { createMailtoHandler } from 'src/helpers/diagnostics';
import { isInBeta } from 'src/helpers/release-stream';
import { DIAGNOSTICS_TITLE } from 'src/helpers/words';
import { useNetInfoProvider } from 'src/hooks/use-net-info-provider';
import { BugButton } from './BugButton';

const BugButtonHandler = () => {
	const { attempt } = useContext(AccessContext);
	const {
		isConnected,
		isPoorConnection,
		downloadBlocked,
		isInternetReachable,
		type,
	} = useNetInfoProvider();
	const netInfo = {
		isConnected,
		isPoorConnection,
		downloadBlocked,
		isInternetReachable,
		type,
	};
	return isInBeta() ? (
		<BugButton
			onPress={createMailtoHandler(
				'Report a bug',
				'',
				attempt,
				netInfo,
				DIAGNOSTICS_TITLE,
			)}
		/>
	) : null;
};

export { BugButtonHandler };
