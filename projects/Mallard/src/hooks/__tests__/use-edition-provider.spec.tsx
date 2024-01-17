import { defaultSettings } from 'src/helpers/settings/defaults';
import {
	defaultEditionCache,
	editionsListCache,
	selectedEditionCache,
} from 'src/helpers/storage';
import type { EditionId, SpecialEdition } from '../../../../Apps/common/src';
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults';
import {
	BASE_EDITION,
	DEFAULT_EDITIONS_LIST,
	defaultEditionDecider,
	fetchEditions,
	getDefaultEdition,
	getEditions,
	getSelectedEditionSlug,
	removeExpiredSpecialEditions,
} from '../use-edition-provider';
import { DownloadBlockedStatus } from '../use-net-info-provider';

const IS_CONNECTED = true;

jest.mock('src/services/remote-config', () => ({
	remoteConfigService: {
		getBoolean: jest.fn().mockReturnValue(true),
	},
}));

const specialEditions: SpecialEdition[] = [
	{
		edition: 'special-edition-expired' as EditionId,
		expiry: new Date(2020, 1, 1).toISOString(),
		editionType: 'Special',
		notificationUTCOffset: 1,
		topic: 'food',
		title: `Food
Monthly`,
		subTitle: 'Store cupboard special: 20 quick and easy lockdown suppers',
		header: {
			title: 'Food',
			subTitle: 'Monthly',
		},
		buttonImageUri:
			'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
		buttonStyle: {
			backgroundColor: '#FEEEF7',
			expiry: {
				color: '#7D0068',
				font: 'GuardianTextSans-Regular',
				lineHeight: 16,
				size: 15,
			},

			subTitle: {
				color: '#7D0068',
				font: 'GuardianTextSans-Bold',
				lineHeight: 20,
				size: 17,
			},
			title: {
				color: '#121212',
				font: 'GHGuardianHeadline-Regular',
				lineHeight: 34,
				size: 34,
			},
			image: {
				height: 134,
				width: 87,
			},
		},
	},
	{
		edition: 'special-edition-notexpired' as EditionId,
		expiry: new Date(3000, 3, 1).toISOString(),
		editionType: 'Special',
		notificationUTCOffset: 1,
		topic: 'food',
		title: `Food
Monthly`,
		subTitle: 'Store cupboard special: 20 quick and easy lockdown suppers',
		header: {
			title: 'Food',
			subTitle: 'Monthly',
		},
		buttonImageUri:
			'https://media.guim.co.uk/49cebb0db4a3e4d26d7d190da7be4a2e9bd7534f/0_0_103_158/103.png',
		buttonStyle: {
			backgroundColor: '#FEEEF7',
			expiry: {
				color: '#7D0068',
				font: 'GuardianTextSans-Regular',
				lineHeight: 16,
				size: 15,
			},

			subTitle: {
				color: '#7D0068',
				font: 'GuardianTextSans-Bold',
				lineHeight: 20,
				size: 17,
			},
			title: {
				color: '#121212',
				font: 'GHGuardianHeadline-Regular',
				lineHeight: 34,
				size: 34,
			},
			image: {
				height: 134,
				width: 87,
			},
		},
	},
];

describe('removeExpiredSpecialEditions', () => {
	it('should remove an expired special edition and ignore non-expired editions', () => {
		const editionsList = {
			...DEFAULT_EDITIONS_LIST,
			specialEditions: specialEditions,
		};
		const filteredList = removeExpiredSpecialEditions(editionsList);
		expect(filteredList.specialEditions.length).toEqual(1);
		expect(filteredList.specialEditions[0].edition).toEqual(
			'special-edition-notexpired',
		);
	});
});

describe('useEditions', () => {
	describe('getSelectedEditionSlug', () => {
		beforeEach(async () => {
			await selectedEditionCache.reset();
			await editionsListCache.reset();
		});
		it('should return the default slug as there is nothing in Async Storage', async () => {
			const editionSlug = await getSelectedEditionSlug();
			expect(editionSlug).toEqual(BASE_EDITION.edition);
		});
	});

	describe('fetchEditions', () => {
		it('should return json if there is a 200 response from the endpoint', async () => {
			const body = DEFAULT_EDITIONS_LIST;

			global.fetch = jest.fn().mockReturnValue(
				Promise.resolve({
					status: 200,
					json: () => body,
				}),
			);

			const editionsList = await fetchEditions(
				defaultSettings.editionsUrl,
			);
			expect(editionsList).toEqual(body);
		});
		it('should return null if there is not a 200 response from the endpoint', async () => {
			global.fetch = jest.fn().mockReturnValue(
				Promise.resolve({
					status: 500,
				}),
			);

			const editionsList = await fetchEditions(
				defaultSettings.editionsUrl,
			);
			expect(editionsList).toEqual(null);
		});
	});

	describe('getEditions', () => {
		// Dont forget Offline
		beforeEach(async () => {
			await editionsListCache.reset();
		});
		it('should return the editions list from the endpoint in the happy path', async () => {
			const body = DEFAULT_EDITIONS_LIST;

			global.fetch = jest.fn().mockReturnValue(
				Promise.resolve({
					status: 200,
					json: () => body,
				}),
			);

			const editions = await getEditions(IS_CONNECTED);
			const editionsListInCache = await editionsListCache.get();
			expect(editions).toEqual(body);
			expect(editionsListInCache).toEqual(body);
		});
		it('should return the editions list from the cache if endpoint is not avaialble', async () => {
			global.fetch = jest.fn().mockReturnValue(
				Promise.resolve({
					status: 500,
				}),
			);

			await editionsListCache.set(DEFAULT_EDITIONS_LIST);

			const editions = await getEditions(IS_CONNECTED);
			expect(editions).toEqual(DEFAULT_EDITIONS_LIST);
		});
		it('should return the default editions list if there is nothing from the endpoint and no cache', async () => {
			global.fetch = jest.fn().mockReturnValue(
				Promise.resolve({
					status: 500,
				}),
			);

			const editions = await getEditions(IS_CONNECTED);
			expect(editions).toEqual(DEFAULT_EDITIONS_LIST);
		});
	});

	describe('getDefaultEdition', () => {
		beforeEach(async () => {
			await defaultEditionCache.reset();
		});
		it('should return the default edition from storage if its there', async () => {
			await defaultEditionCache.set(defaultRegionalEditions[0]);

			const defaultEdition = await getDefaultEdition();
			expect(defaultEdition).toEqual(defaultRegionalEditions[0]);
		});
		it('should return null if default edition is not in storage', async () => {
			const defaultEdition = await getDefaultEdition();
			expect(defaultEdition).toEqual(null);
		});
	});
});
