import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

interface SliderDotsProps {
	numOfItems: number;
	color: string;
	location?: 'article' | 'front';
	position: Animated.AnimatedInterpolation;
	startIndex?: number;
}

const styles = (color: string, location: string, isTablet: boolean) => {
	const dotBuilder = (size: number, marginRight: number) => ({
		width: size,
		height: size,
		borderRadius: size / 2,
		marginRight,
	});

	const dotFront = isTablet ? dotBuilder(14, 7) : dotBuilder(10, 4);

	const dotArticle = dotBuilder(8, 2);

	const dot = location === 'article' ? dotArticle : dotFront;

	return StyleSheet.create({
		dotsContainer: {
			flexDirection: 'row',
			paddingVertical: 2,
		},
		dot,
		selected: {
			backgroundColor: color,
		},
	});
};

const SliderDots = React.memo(
	({
		numOfItems,
		color,
		location = 'article',
		position,
		startIndex,
	}: SliderDotsProps) => {
		const dots = [];
		const isTablet = DeviceInfo.isTablet();
		const appliedStyle = styles(color, location, isTablet);

		const newPos: any =
			Platform.OS === 'android' && startIndex
				? Number(position) - startIndex
				: startIndex
				? Animated.subtract(position, startIndex)
				: position;

		const range = (i: number) => ({
			inputRange: [
				i - 0.50000000001,
				i - 0.5,
				i,
				i + 0.5,
				i + 0.50000000001,
			],
			outputRange: ['#DCDCDC', color, color, color, '#DCDCDC'],
		});

		for (let i = 0; i < numOfItems; i++) {
			const backgroundColor =
				Platform.OS === 'android' && location === 'article'
					? i === newPos
						? color
						: '#DCDCDC'
					: newPos.interpolate({
							...range(i),
							extrapolate: 'clamp',
					  });

			dots.push(
				<Animated.View
					key={i}
					style={[
						appliedStyle.dot,
						{
							backgroundColor,
						},
					]}
				></Animated.View>,
			);
		}

		return <View style={appliedStyle.dotsContainer}>{dots}</View>;
	},
);

export { SliderDots };
