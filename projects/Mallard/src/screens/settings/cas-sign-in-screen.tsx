import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Image from 'react-native-fast-image';
import { AccessContext } from '../../authentication/AccessContext';
import { isValid } from '../../authentication/lib/Attempt';
import { LoginButton } from '../../components/login/login-button';
import { LoginInput } from '../../components/login/login-input';
import { LoginLayout } from '../../components/login/login-layout';
import { useFormField } from '../../hooks/use-form-field';
import type { MainStackParamList } from '../../navigation/NavigationModels';
import { RouteNames } from '../../navigation/NavigationModels';
import { getFont } from '../../theme/typography';

const styles = StyleSheet.create({
	image: { height: 200, width: undefined },
	casExplainerTitle: { ...getFont('headline', 1, 'bold') },
	casExplainerBody: { ...getFont('headline', 1, 'regular') },
});

const CasSignInScreen = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { authCAS } = useContext(AccessContext);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [shouldShowError, setShouldShowError] = useState(false);

	const subscriberID = useFormField('', {
		validator: (subId) => (subId ? null : 'Please enter a subscriber ID'),
		onSet: () => setErrorMessage(null),
	});
	const password = useFormField('', {
		validator: (password) =>
			password ? null : 'Please enter a postcode or surname',
		onSet: () => setErrorMessage(null),
	});

	const handleSubmit = async () => {
		if (subscriberID.error || password.error) {
			setShouldShowError(true);
			return;
		}
		const { accessAttempt } = await authCAS(
			subscriberID.value,
			password.value,
		);
		if (isValid(accessAttempt)) {
			navigation.navigate(RouteNames.SubFoundModal, {
				closeAction: () => navigation.navigate(RouteNames.Issue),
			});
		} else {
			setErrorMessage(accessAttempt.reason ?? 'Something went wrong');
		}
		setIsLoading(false);
	};

	return (
		<LoginLayout
			title="Activate your subscription"
			onDismiss={() => navigation.goBack()}
			isLoading={isLoading}
			errorMessage={errorMessage}
		>
			<View>
				<LoginInput
					error={shouldShowError ? subscriberID.error : null}
					onChangeText={subscriberID.setValue}
					label="Subscriber ID (including all zeros)"
					accessibilityLabel="subscriber id input"
					value={subscriberID.value}
				/>
				<LoginInput
					error={shouldShowError ? password.error : null}
					onChangeText={password.setValue}
					label="Postcode or surname"
					accessibilityLabel="postcode or surname input"
					value={password.value}
				/>
				<LoginButton type="cta" onPress={handleSubmit}>
					Submit
				</LoginButton>
				<Text style={styles.casExplainerTitle}>
					What&apos;s a subscriber ID?
				</Text>
				<Text style={styles.casExplainerBody}>
					You can find your subscriber ID on your subscription
					confirmation email. If you collect your paper, your
					subscriber ID is on your voucher.
				</Text>

				<Image
					resizeMode="contain"
					style={styles.image}
					source={require(`../../assets/images/cas-voucher.jpg`)}
				/>
			</View>
		</LoginLayout>
	);
};

export { CasSignInScreen };
