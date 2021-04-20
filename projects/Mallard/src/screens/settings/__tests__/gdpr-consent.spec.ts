import AsyncStorage from '@react-native-community/async-storage';
import {
	gdprAllowFunctionalityKey,
	gdprAllowPerformanceKey,
	SETTINGS_KEY_PREFIX,
} from 'src/helpers/settings';
import { resetAll, setConsent } from '../gdpr-consent-screen';

jest.mock('react-native-device-info', () => ({
	isTablet: () => false,
}));

const getperf = async () =>
	await AsyncStorage.getItem(SETTINGS_KEY_PREFIX + gdprAllowPerformanceKey);

const getfunc = async () =>
	await AsyncStorage.getItem(SETTINGS_KEY_PREFIX + gdprAllowFunctionalityKey);

describe('gdpr-consent', () => {
	describe('setConsent', () => {
		it('should set consent values in AsyncStorage', async () => {
			setConsent(gdprAllowPerformanceKey, true);
			expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);

			const newValue = await getperf();
			expect(newValue).toBe('true');
			setConsent(gdprAllowPerformanceKey, false);
			const falseValue = await getperf();
			expect(falseValue).toBe('false');
		});
	});

	describe('resetConsent', () => {
		it('should reset consent values properly', async () => {
			setConsent(gdprAllowPerformanceKey, true);
			setConsent(gdprAllowFunctionalityKey, true);

			resetAll();

			const perfValue = await getperf();
			expect(perfValue).toBe('null');

			const funcValue = await getfunc();
			expect(funcValue).toBe('null');
		});
	});
});
