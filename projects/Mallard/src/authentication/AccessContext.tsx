import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { validAttemptCache } from 'src/helpers/storage';
import { useNetInfo } from 'src/hooks/use-net-info-provider';
import type { CASExpiry } from '../../../Apps/common/src/cas-expiry';
import cas from './authorizers/CASAuthorizer';
import iap from './authorizers/IAPAuthorizer';
import type {
	AuthParams,
	IdentityAuthData,
} from './authorizers/IdentityAuthorizer';
import identity from './authorizers/IdentityAuthorizer';
import type { OktaAuthData } from './authorizers/OktaAuthorizer';
import okta from './authorizers/OktaAuthorizer';
import { AccessController } from './lib/AccessController';
import type { AnyAttempt, ResolvedAttempt } from './lib/Attempt';
import { InvalidAttempt, isNotRun, isValid, NotRun } from './lib/Attempt';
import type { ReceiptIOS } from './services/iap';

type AttemptType = 'iap' | 'cas' | 'identity' | 'okta';

type AttemptResponse<T> = {
	attempt: ResolvedAttempt<T>;
	accessAttempt: ResolvedAttempt<AttemptType>;
};

const defaultAttemptResponse = Promise.resolve({
	attempt: InvalidAttempt('offline'),
	accessAttempt: InvalidAttempt('offline'),
});

const AccessContext = createContext({
	attempt: NotRun as AnyAttempt<AttemptType>,
	canAccess: false,
	authIdentity: (
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		params: AuthParams,
	): Promise<AttemptResponse<IdentityAuthData>> => defaultAttemptResponse,
	authCAS: (
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		subscriberId: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		password: string,
	): Promise<AttemptResponse<CASExpiry>> =>
		Promise.resolve(defaultAttemptResponse),
	authIAP: (): Promise<AttemptResponse<ReceiptIOS>> =>
		Promise.resolve(defaultAttemptResponse),
	authOkta: (): Promise<AttemptResponse<OktaAuthData>> =>
		Promise.resolve(defaultAttemptResponse),
	identityData: null as IdentityAuthData | null,
	casData: null as CASExpiry | null,
	iapData: null as ReceiptIOS | null,
	oktaData: null as any,
	signOutIdentity: () => {},
	signOutCAS: () => {},
	signOutOkta: () => {},
});

const controller = new AccessController(
	{
		identity,
		cas,
		iap,
		okta,
	},
	validAttemptCache,
);

const authCAS = cas.runAuth.bind(cas);
const authIAP = iap.runAuth.bind(iap);
const signOutCAS = cas.signOut.bind(cas);
const authIdentity = identity.runAuth.bind(identity);
const signOutIdentity = identity.signOut.bind(identity);
const signOutOkta = okta.signOut.bind(okta);
const authOkta = okta.runAuth.bind(okta);

const AccessProvider = ({
	children,
	onIdentityStatusChange = () => {},
	onOktaStatusChange = () => {},
}: {
	children: React.ReactNode;
	onIdentityStatusChange?: (idAttempt: AnyAttempt<IdentityAuthData>) => void;
	onOktaStatusChange?: (idAttempt: AnyAttempt<OktaAuthData>) => void;
}) => {
	const [attempt, setAttempt] = useState<AnyAttempt<AttemptType>>(
		controller.getAttempt(),
	);
	const [idAuth, setIdAuth] = useState<AnyAttempt<IdentityAuthData>>(
		controller.authorizerMap.identity.getAttempt(),
	);
	const [casAuth, setCASAuth] = useState<AnyAttempt<CASExpiry>>(
		controller.authorizerMap.cas.getAttempt(),
	);
	const [iapAuth, setIAPAuth] = useState<AnyAttempt<ReceiptIOS>>(
		controller.authorizerMap.iap.getAttempt(),
	);
	const [oktaAuth, setOktaAuth] = useState<AnyAttempt<OktaAuthData>>(
		controller.authorizerMap.okta.getAttempt(),
	);
	const { isConnected, isPoorConnection } = useNetInfo();

	useEffect(() => {
		const unsubController = controller.subscribe(setAttempt);
		const unsubIdentity = controller.authorizerMap.identity.subscribe(
			(attempt) => {
				setIdAuth(attempt);
				onIdentityStatusChange(attempt);
			},
		);
		const unsubCAS = controller.authorizerMap.cas.subscribe(setCASAuth);
		const unsubIAP = controller.authorizerMap.iap.subscribe(setIAPAuth);
		const unsubOkta = controller.authorizerMap.okta.subscribe((attempt) => {
			setOktaAuth(attempt);
			onOktaStatusChange(attempt);
		});

		controller.handleConnectionStatusChanged(isConnected, isPoorConnection);

		return () => {
			unsubController();
			unsubIdentity();
			unsubCAS();
			unsubIAP();
			unsubOkta();
		};
	}, []);

	const value = useMemo(
		() => ({
			attempt,
			canAccess: (!!attempt && isValid(attempt)) || isNotRun(attempt),
			identityData: isValid(idAuth) ? idAuth.data : null,
			casData: isValid(casAuth) ? casAuth.data : null,
			iapData: isValid(iapAuth) ? iapAuth.data : null,
			oktaData: isValid(oktaAuth) ? oktaAuth.data : null,
			authCAS,
			authIAP,
			authOkta,
			signOutCAS,
			authIdentity,
			signOutIdentity,
			signOutOkta,
		}),
		[attempt, casAuth, idAuth, iapAuth, oktaAuth],
	);

	return (
		<AccessContext.Provider value={value}>
			{children}
		</AccessContext.Provider>
	);
};

const useAccess = () => useContext(AccessContext).canAccess;
const useIdentity = () => useContext(AccessContext).identityData;
const useOktaData = () => useContext(AccessContext).oktaData;

export { AccessProvider, useAccess, useIdentity, useOktaData, AccessContext };
