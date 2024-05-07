import {
	defaultEditionCache,
	editionsListCache,
	selectedEditionCache,
} from '../../helpers/storage';
import { BASE_EDITION, defaultEditionDecider } from '../use-edition-provider';
import { DownloadBlockedStatus } from '../use-net-info-provider';

jest.mock('../../services/remote-config', () => ({
	remoteConfigService: {
		getBoolean: jest.fn().mockReturnValue(true),
	},
}));

jest.mock('../../helpers/locale', () => ({
	locale: 'fr_FR',
}));

describe('useEditions', () => {
	describe('defaultEditionDecider', () => {
		beforeEach(async () => {
			await editionsListCache.reset();
		});
		it('should set the BASE EDITION if locale is not in the list', async () => {
			const defaultLocalState = jest.fn();
			const selectedLocalState = jest.fn();

			await defaultEditionDecider(
				defaultLocalState,
				selectedLocalState,
				DownloadBlockedStatus.NotBlocked,
				() => {},
			);
			expect(defaultLocalState).toBeCalledTimes(1);
			expect(defaultLocalState).toBeCalledWith(BASE_EDITION);
			expect(selectedLocalState).toBeCalledTimes(1);
			expect(selectedLocalState).toBeCalledWith(BASE_EDITION);
			const selectedEdition = await selectedEditionCache.get();
			expect(selectedEdition).toEqual(BASE_EDITION);
			const defaultEdition = await defaultEditionCache.get();
			expect(defaultEdition).toEqual(BASE_EDITION);
		});
	});
});
