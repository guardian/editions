import { color, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLogo } from './AppLogo';
import { BurgerMenu } from './BurgerMenu';
import { Editions } from './Editions';
import { EditionsMenu } from './EditionsMenu';
import { LeftChevron } from './LeftChevron';
import { Newspaper } from './Newspaper';
import { Quote } from './Quote';
import { RightChevron } from './RightChevron';
import { SettingsCog } from './SettingsCog';

const styles = StyleSheet.create({
	icon: {
		padding: 20,
		borderBottomColor: '#333333',
		borderBottomWidth: 1,
		flexDirection: 'row',
	},
	label: {
		paddingLeft: 20,
		alignSelf: 'center',
	},
});

storiesOf('Icons', module)
	.addDecorator(withKnobs)
	.add('All Icons', () => (
		<>
			<View style={styles.icon}>
				<Quote fill={color('Colour', '#000000')} />
				<Text style={styles.label}>Quote</Text>
			</View>
			<View style={styles.icon}>
				<LeftChevron />
				<Text style={styles.label}>LeftChevron</Text>
			</View>
			<View style={styles.icon}>
				<RightChevron />
				<Text style={styles.label}>RightChevron</Text>
			</View>
			<View style={styles.icon}>
				<Newspaper />
				<Text style={styles.label}>Newspaper</Text>
			</View>
			<View style={styles.icon}>
				<Editions />
				<Text style={styles.label}>Editions</Text>
			</View>
			<View style={styles.icon}>
				<AppLogo />
				<Text style={styles.label}>App Logo</Text>
			</View>
			<View style={styles.icon}>
				<BurgerMenu />
				<Text style={styles.label}>BurgerMenu</Text>
			</View>
			<View style={styles.icon}>
				<EditionsMenu />
				<Text style={styles.label}>EditionsMenu</Text>
			</View>
			<View style={styles.icon}>
				<SettingsCog />
				<Text style={styles.label}>SettingsCog</Text>
			</View>
		</>
	));
