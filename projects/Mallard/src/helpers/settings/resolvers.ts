/**
 * This exposes Apollo resolvers for all setting as well as query helpers
 */
import { getSetting } from 'src/helpers/settings';

/**
 * Build a piece of GraphQL query string that would fetch all the settings with
 * the provided names. Ex. `foo @client, bar @client` to fetch `foo` and `bar`.
 */
const makeFragment = (names: string[]) =>
	names.map((name) => `${name} @client,`).join('');

const ALL_NAMES = [
	'apiUrl', // This should be an east one to remove.
	'isUsingProdDevtools', // This should be an easy one to remove
];

/**
 * Insert this in a query to fetch all setting. In practice, only useful for the
 * Dev menu.
 */
export const ALL_SETTINGS_FRAGMENT = makeFragment(ALL_NAMES);

export const SettingValues: Map<string, Promise<unknown>> = new Map();

/**
 * Build up a separate Apollo resolver function for each of all the known
 * settings.
 */
const SETTINGS_RESOLVERS: Record<string, any> = {};
for (const name of ALL_NAMES) {
	SETTINGS_RESOLVERS[name] = () => {
		if (!SettingValues.has(name)) {
			SettingValues.set(name, getSetting(name as any));
		}
		return SettingValues.get(name);
	};
}

export { SETTINGS_RESOLVERS };
