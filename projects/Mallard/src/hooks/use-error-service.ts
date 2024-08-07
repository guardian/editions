import { useEffect } from 'react';
import { errorService } from '../services/errors';
import { useGdprSettings } from './use-gdpr';

export const useErrorService = () => {
	const { gdprAllowPerformance } = useGdprSettings();

	useEffect(() => {
		__DEV__ && errorService.init({ hasConsent: gdprAllowPerformance });
	}, [gdprAllowPerformance]);
};
