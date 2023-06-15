import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AccessContext } from 'src/authentication/AccessContext';
import type { AuthParams } from 'src/authentication/authorizers/IdentityAuthorizer';
import { isValid } from 'src/authentication/lib/Attempt';
import {
	appleNativeAuth,
	getErrorString,
} from 'src/authentication/services/apple';
import { appleAuthWithDeepRedirect } from 'src/authentication/services/apple-oauth';
import { googleAuthWithDeepRedirect } from 'src/authentication/services/google';
import { Copy } from 'src/helpers/words';
import { useFormField } from 'src/hooks/use-form-field';
import { useGdprSettings } from 'src/hooks/use-gdpr';
import type { CompositeNavigationStackProps } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import isEmail from 'validator/lib/isEmail';
import { Login } from './log-in';
import { oktaAuth } from 'src/authentication/services/okta';

const useRandomState = () =>
	useState(Math.random().toString().split('.')[1])[0];

const AuthSwitcherScreen = () => {
	const { authOkta } = useContext(AccessContext);
	const navigation = useNavigation<CompositeNavigationStackProps>();
	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const email = useFormField('', {
		validator: (email) =>
			email
				? isEmail(email)
					? null
					: Copy.authSwitcherScreen.invalidEmail
				: Copy.authSwitcherScreen.emptyEmail,
		onSet: () => setError(null),
	});
	const password = useFormField('', {
		validator: (password) =>
			password ? null : Copy.authSwitcherScreen.invalidPassword,
		onSet: () => setError(null),
	});

	const validatorString = useRandomState();

	const { authIdentity } = useContext(AccessContext);
	const { gdprAllowFunctionality } = useGdprSettings();

	// Compare this with CAS - we will probably need this function?

	const handleAuthClick = useCallback(
		async (
			runGetIdentityAuthParams: () => Promise<AuthParams>,
			{
				requiresFunctionalConsent,
				signInName,
			}: { requiresFunctionalConsent: boolean; signInName?: string },
		) => {
			setError(null);
			// @TODO tidy this area up as its now not following functional paradigms
			const allow = async () => {
				setIsLoading(true);
				try {
					const { attempt, accessAttempt } = await authIdentity(
						// This runs the okta piece
						await runGetIdentityAuthParams(),
					);
					console.log('attempt: ', attempt);
					console.log('accessAttempt: ', accessAttempt);
					console.log('isValid(attempt): ', isValid(attempt));

					if (isValid(attempt)) {
						setIsLoading(false);
						if (!isValid(accessAttempt)) {
							navigation.navigate(RouteNames.SignInFailedModal, {
								emailAddress:
									attempt.data.userDetails
										.primaryEmailAddress,
							});
						} else {
							navigation.navigate(RouteNames.SubFoundModal);
						}
					} else {
						attempt.reason && setError(attempt.reason);
						// push this into the catch logic below
						throw attempt.reason;
					}
				} catch (e) {
					const appleErrorString = getErrorString(e);
					appleErrorString && setError(appleErrorString);
					setIsLoading(false);
				}
			};

			const deny = async () => {
				Alert.alert(
					Copy.authSwitcherScreen.socialSignInDisabledTitle.replace(
						'%signInName%',
						signInName ?? 'Social',
					),
					Copy.authSwitcherScreen.socialSignInDisabledSubtitle.replace(
						'%signInName%',
						signInName ?? 'social',
					),
				);
			};

			(gdprAllowFunctionality && requiresFunctionalConsent) ||
			!requiresFunctionalConsent
				? await allow()
				: await deny();
		},
		[gdprAllowFunctionality],
	);

	const handleSubmit = async () => {
		const { accessAttempt } = await authOkta();
		console.log('handleSubmit: ', accessAttempt);
		if (isValid(accessAttempt)) {
			navigation.navigate(RouteNames.SubFoundModal);
		} else {
			console.log('BAD: ');
			// setErrorMessage(
			// 	accessAttempt.reason ?? 'Something went wrong',
			// );
		}
		setIsLoading(false);
	};

	return (
		<Login
			title={Copy.authSwitcherScreen.title}
			resetLink="https://profile.theguardian.com/reset"
			emailProgressText={Copy.authSwitcherScreen.nextButton}
			submitText="Sign me in"
			email={email}
			password={password}
			isLoading={isLoading}
			onDismiss={() => navigation.popToTop()}
			onHelpPress={() =>
				navigation.navigate(RouteNames.AlreadySubscribedOverlay)
			}
			onGooglePress={() =>
				handleAuthClick(
					() =>
						googleAuthWithDeepRedirect(validatorString).then(
							(token) => ({
								'google-access-token': token,
							}),
						),
					{ requiresFunctionalConsent: true, signInName: 'Google' },
				)
			}
			onAppleOAuthPress={() => {
				handleAuthClick(
					() =>
						appleAuthWithDeepRedirect(validatorString).then(
							(token) => {
								return {
									'apple-sign-in-token': token,
								};
							},
						),
					{
						requiresFunctionalConsent: true,
						signInName: 'AppleOauth',
					},
				);
			}}
			onApplePress={() =>
				handleAuthClick(() => appleNativeAuth(validatorString), {
					requiresFunctionalConsent: true,
					signInName: 'Apple',
				})
			}
			onOktaPress={() =>
				// handleAuthClick(() => oktaAuth(), {
				// 	signInName: 'Okta',
				// })
				handleSubmit()
			}
			onSubmit={() =>
				handleAuthClick(
					async () => ({
						email: email.value,
						password: password.value,
					}),
					{ requiresFunctionalConsent: false },
				)
			}
			errorMessage={error}
		/>
	);
};

export { AuthSwitcherScreen };
