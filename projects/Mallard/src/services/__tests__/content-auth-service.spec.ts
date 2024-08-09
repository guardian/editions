import { fetchCasSubscription } from '../content-auth-service';

describe('content-auth-service', () => {
	describe('fetchCasSubscription', () => {
		it('throws an error on non-200 responses', async () => {
			global.fetch = jest.fn().mockReturnValue(
				Promise.resolve({
					status: 419,
					json: () =>
						JSON.stringify({
							error: {
								message: 'error-message',
							},
						}),
				}),
			);

			let error;

			try {
				await fetchCasSubscription('subId', 'pass');
			} catch (e) {
				error = e;
			}

			expect(error).toBeInstanceOf(Error);
		});
	});
});
