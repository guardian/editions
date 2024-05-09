import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from '../../../../components/Button/Button';
import {
	UiBodyCopy,
	UiExplainerCopy,
} from '../../../../components/styled-text';
import { GENERIC_ERROR } from '../../../../helpers/words';
import { WithAppAppearance } from '../../../../theme/appearance';
import { metrics } from '../../../../theme/spacing';

export interface PropTypes {
	title?: string;
	message?: string;
	debugMessage?: string;
	action?: [string, () => void];
}

const ErrorMessage = ({ title, message, debugMessage, action }: PropTypes) => {
	return (
		<WithAppAppearance value={'tertiary'}>
			<>
				{!!title && (
					<UiBodyCopy weight="bold" style={{ textAlign: 'center' }}>
						{title}
					</UiBodyCopy>
				)}
				{!!message && (
					<UiExplainerCopy style={{ textAlign: 'center' }}>
						{message}
					</UiExplainerCopy>
				)}
				{__DEV__ && debugMessage ? (
					<TouchableOpacity
						onPress={() => {
							Clipboard.setString(debugMessage);
						}}
					>
						<UiExplainerCopy style={{ textAlign: 'center' }}>
							{debugMessage}
						</UiExplainerCopy>
					</TouchableOpacity>
				) : null}
				{!!action && (
					<Button
						style={{ marginTop: metrics.vertical }}
						onPress={action[1]}
					>
						{action[0]}
					</Button>
				)}
			</>
		</WithAppAppearance>
	);
};
ErrorMessage.defaultProps = {
	title: GENERIC_ERROR,
};

export { ErrorMessage };
