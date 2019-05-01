import React from 'react';
import { Text, View } from 'react-native';

export class MonoText extends React.Component {
	render() {
		return (
			<Text
				{...this.props}
				style={[this.props.style, { fontFamily: 'space-mono' }]}
			/>
		);
	}
}

export class MonoTextBlock extends React.Component {
	render() {
		return (
			<View
				style={[
					this.props.style,
					{
						padding: 16,
					},
				]}
			>
				<MonoText
					style={{ textAlign: 'center', textAlignVertical: 'center' }}
					{...this.props}
				/>
			</View>
		);
	}
}
