import * as files from '../../helpers/files';
import {
	getIssueSummary,
	issueSummaryToLatestPath,
} from '../use-issue-summary-provider';

jest.mock('react-native-fs', () => ({
	readFile: () => Promise.resolve(JSON.stringify(exampleIssueSummary)),
}));

jest.mock('../use-config-provider', () => ({
	getMaxAvailableEditions: () => Promise.resolve(1),
}));

const exampleIssueSummary = [
	{
		assets: {
			data: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/data.zip',
			phone: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/phone.zip',
			tablet: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/tablet.zip',
			tabletL:
				'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/tabletL.zip',
			tabletXL:
				'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/tabletXL.zip',
		},
		assetsSSR: {
			data: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/data.zip',
			html: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/html.zip',
			phone: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/phone.zip',
			tablet: 'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/tablet.zip',
			tabletL:
				'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/tabletL.zip',
			tabletXL:
				'zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/tabletXL.zip',
		},
		date: '2021-10-05',
		key: 'daily-edition/2021-10-05',
		localId: 'daily-edition/2021-10-05',
		name: 'UK Daily',
		publishedId: 'daily-edition/2021-10-05/2021-10-05T01:02:01.008Z',
	},
	{
		assets: {
			data: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/data.zip',
			phone: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/phone.zip',
			tablet: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/tablet.zip',
			tabletL:
				'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/tabletL.zip',
			tabletXL:
				'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/tabletXL.zip',
		},
		assetsSSR: {
			data: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/data.zip',
			html: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/ssr/html.zip',
			phone: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/ssr/phone.zip',
			tablet: 'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/ssr/tablet.zip',
			tabletL:
				'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/ssr/tabletL.zip',
			tabletXL:
				'zips/daily-edition/2021-10-04/2021-10-04T00:27:49.527Z/ssr/tabletXL.zip',
		},
		date: '2021-10-04',
		key: 'daily-edition/2021-10-04',
		localId: 'daily-edition/2021-10-04',
		name: 'UK Daily',
		publishedId: 'daily-edition/2021-10-04/2021-10-04T00:27:49.527Z',
	},
];

const spyFetchAndStoreIssueSummary = jest
	.spyOn(files, 'fetchAndStoreIssueSummary')
	.mockResolvedValue(exampleIssueSummary);

const spyReadSummary = jest
	.spyOn(files, 'fetchAndStoreIssueSummary')
	.mockResolvedValue(exampleIssueSummary);

describe('use-issue-summary-provider', () => {
	describe('getIssueSummary', () => {
		it('should call fetchAndStoreIssueSummary by default', async () => {
			await getIssueSummary();
			expect(spyFetchAndStoreIssueSummary).toHaveBeenCalled();
		});
		it('should call fetchAndStoreIssueSummary if there is connection and its NOT poor', async () => {
			await getIssueSummary(true, false);
			expect(spyFetchAndStoreIssueSummary).toHaveBeenCalled();
		});
		it('should call readIssueSummary if there is no connection', async () => {
			await getIssueSummary(false);
			expect(spyReadSummary).toHaveBeenCalled();
		});
		it('should call readIssueSummary if there is a connection but its poor', async () => {
			await getIssueSummary(true, true);
			expect(spyReadSummary).toHaveBeenCalled();
		});
		it('should trim the issue summary based on the number of editions chosen', async () => {
			const issueSummary = await getIssueSummary();
			expect(issueSummary).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "assets": Object {
			      "data": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/data.zip",
			      "phone": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/phone.zip",
			      "tablet": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/tablet.zip",
			      "tabletL": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/tabletL.zip",
			      "tabletXL": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/tabletXL.zip",
			    },
			    "assetsSSR": Object {
			      "data": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/data.zip",
			      "html": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/html.zip",
			      "phone": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/phone.zip",
			      "tablet": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/tablet.zip",
			      "tabletL": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/tabletL.zip",
			      "tabletXL": "zips/daily-edition/2021-10-05/2021-10-05T01:02:01.008Z/ssr/tabletXL.zip",
			    },
			    "date": "2021-10-05",
			    "key": "daily-edition/2021-10-05",
			    "localId": "daily-edition/2021-10-05",
			    "name": "UK Daily",
			    "publishedId": "daily-edition/2021-10-05/2021-10-05T01:02:01.008Z",
			  },
			]
		`);
		});
	});

	describe('issueSummaryToLatest', () => {
		it('should return an appropriate issue id based on a valid issue summary', () => {
			const latestId = issueSummaryToLatestPath(exampleIssueSummary);
			expect(latestId).toEqual({
				localIssueId: exampleIssueSummary[0].localId,
				publishedIssueId: exampleIssueSummary[0].publishedId,
			});
		});
	});
});
