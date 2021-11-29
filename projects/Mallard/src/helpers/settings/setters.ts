/**
 * This exposes functions to update settings. Mutating a setting will update the
 * value in Apollo's client cache, which will trigger all dependent React
 * components to refresh. It also persists the new value in async storage.
 */
import type ApolloClient from 'apollo-client';
import type { Settings } from 'src/helpers/settings';
import { storeSetting } from 'src/helpers/settings';
import { SettingValues } from './resolvers';

const setSetting = (
	name: keyof Settings,
	client: ApolloClient<object>,
	value: any,
) => {
	storeSetting(name, value);
	SettingValues.set(name, Promise.resolve(value));
	client.writeData({ data: { [name]: value } });
};

const createSetter = <Name extends keyof Settings>(
	name: Name,
): ((client: ApolloClient<object>, value: Settings[Name]) => void) => {
	return setSetting.bind(undefined, name);
};

export const setApiUrl = createSetter('apiUrl');
export const setIsUsingProdDevtools = createSetter('isUsingProdDevtools');
