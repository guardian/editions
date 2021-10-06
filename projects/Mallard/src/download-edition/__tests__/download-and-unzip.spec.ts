import { DownloadBlockedStatus } from 'src/hooks/use-net-info-provider';
import { downloadAndUnzipIssue } from '../download-and-unzip';

const createIssueSummary = (localId: string) => ({
	key: 'de/1-1-1',
	name: 'any',
	date: '1-1-1',
	localId,
	publishedId: '1/1',
	assets: { data: '' },
});

describe('download', () => {
	describe('downloadAndUnzipIssue', () => {
		it('should resolve the outer promise when the download runner resolves', async () => {
			const localId = '1';
			const p = downloadAndUnzipIssue(
				createIssueSummary(localId),
				'phone',
				DownloadBlockedStatus.NotBlocked,
				() => {},
				() => Promise.resolve(),
				// the above promise is the main downloader that drives the outer promise
				// and also updates the progress handler
				// this is not part of the main API but passing it in tests is much easier than mocking
				// all the downloads
			);
			await expect(p).resolves.toBeUndefined();
		});
		it('should not set any statuses without the passed promise calling an updater', async () => {
			const updateStatus = jest.fn(() => {});
			const p = downloadAndUnzipIssue(
				createIssueSummary('1'),
				'phone',
				DownloadBlockedStatus.NotBlocked,
				updateStatus,
				() => Promise.resolve(),
			);
			expect(updateStatus).not.toHaveBeenCalled();
			await p;
		});
		it('should create new downloads when previous ones have finished', async () => {
			const localId = '1';
			const p1 = downloadAndUnzipIssue(
				createIssueSummary(localId),
				'phone',
				DownloadBlockedStatus.NotBlocked,
				() => {},
				() => Promise.resolve(),
			);
			const p2 = downloadAndUnzipIssue(
				createIssueSummary(localId),
				'phone',
				DownloadBlockedStatus.NotBlocked,
				() => {},
				() => Promise.resolve(),
			);
			await Promise.all([p1, p2]);
			const p3 = downloadAndUnzipIssue(
				createIssueSummary(localId),
				'phone',
				DownloadBlockedStatus.NotBlocked,
				() => {},
				() => Promise.resolve(),
			);
			expect(p3).not.toBe(p2);
			await p3;
		});
	});
});
