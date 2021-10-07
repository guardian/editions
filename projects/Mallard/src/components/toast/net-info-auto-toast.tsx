import { useEffect } from 'react';
import { NetInfoStateType, useNetInfo } from 'src/hooks/use-net-info-provider';
import { useToast } from 'src/hooks/use-toast';

const NetInfoAutoToast = () => {
	const { showToast } = useToast();
	const { isConnected, type } = useNetInfo();
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
