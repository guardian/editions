import { remoteConfigService } from 'src/services/remote-config';

export const isIdentityEnabled =
	remoteConfigService.getBoolean('identity_enabled');
