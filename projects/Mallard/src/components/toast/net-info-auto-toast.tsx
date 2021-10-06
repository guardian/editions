import { useEffect } from 'react';
import {
	NetInfoStateType,
	useNetInfoProvider,
} from 'src/hooks/use-net-info-provider';
import { useToast } from 'src/hooks/use-toast';

const NetInfoAutoToast = () => {
	const { showToast } = useToast();
	const { isConnected, type } = useNetInfoProvider();
	useEffect(() => {
		const time = setTimeout(() => {
			if (!isConnected && type !== NetInfoStateType.unknown) {
				showToast('No internet connection');
			}
		}, 1000);
		return () => {
			clearTimeout(time);
		};
	}, [isConnected]);
	return null;
};

export { NetInfoAutoToast };
