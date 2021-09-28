module.exports = {
	getCurrentState: jest.fn(() => Promise.resolve()),
	addListener: jest.fn(),
	removeListeners: jest.fn(),
	NetInfoStateType: {
		none: 'none',
		cellular: 'cellular',
		wifi: 'wifi',
		unknown: 'unknown',
	},
	fetch: jest.fn(() => Promise.resolve(true)),
};
