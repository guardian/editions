import React from 'react';
import type {
	StyleProp,
	TouchableWithoutFeedbackProps,
	ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native';

const Highlight: React.FC<
	{
		onPress: () => void;
		children: React.ReactNode;
		style?: StyleProp<ViewStyle>;
	} & TouchableWithoutFeedbackProps
> = ({ onPress, children, style }) => {
	return (
		<TouchableOpacity {...{ style }} onPress={onPress}>
			{children}
		</TouchableOpacity>
	);
};

export { Highlight };
