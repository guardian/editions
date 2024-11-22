import type { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config';
import remoteConfig from '@react-native-firebase/remote-config';

// see https://rnfirebase.io/remote-config/usage for docs

type RemoteStringValue = string | undefined;

interface RemoteConfig {
	init(): void;
	getBoolean(key: RemoteConfigProperty): boolean;
	getString(key: RemoteConfigProperty): RemoteStringValue;
}

const remoteConfigDefaults = {
	join_beta_button_enabled: false,
	lightbox_enabled: true,
	generate_share_url: true,
	download_parallel_ssr_bundle: false,
	rating: false,
	is_editions_menu_enabled: true,
	is_app_migration_message_enabled: true,
};

const RemoteConfigProperties = [
	'join_beta_button_enabled',
	'lightbox_enabled',
	'generate_share_url',
	'download_parallel_ssr_bundle',
	'rating',
	'is_editions_menu_enabled',
	'is_app_migration_message_enabled',
] as const;

type RemoteConfigProperty = (typeof RemoteConfigProperties)[number];

const configValues = {
	// fetch config, cache for 5mins. This cache persists when app is reloaded
	minimumFetchIntervalMillis: 300,
};

class RemoteConfigService implements RemoteConfig {
	init() {
		remoteConfig()
			.setDefaults(remoteConfigDefaults)
			.then(() => remoteConfig().setConfigSettings(configValues))
			.then(() => {
				remoteConfig()
					.fetchAndActivate()
					.then((activated) => {
						if (activated) {
							console.log('Remote config fetched & activated!');
							if (__DEV__) console.log(remoteConfig().getAll());
						} else {
							console.log('Remote config NOT activated!');
						}
					})
					.catch(() => {
						console.log('Remote config failed to fetch');
					});
			})
			.catch(() => {
				console.log(
					'Remote config not activated - something went wrong',
				);
			});
	}

	getBoolean(key: RemoteConfigProperty): boolean {
		return remoteConfig().getValue(key).asBoolean();
	}

	getString(key: RemoteConfigProperty): RemoteStringValue {
		return remoteConfig().getValue(key).asString();
	}

	listProperties(): FirebaseRemoteConfigTypes.ConfigValues {
		return remoteConfig().getAll();
	}
}

export const remoteConfigService = new RemoteConfigService();
