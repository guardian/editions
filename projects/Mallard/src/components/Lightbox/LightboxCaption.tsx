import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Direction } from '../../../../Apps/common/src';
import { ArticleTheme } from '../../components/article/article';
import { themeColors } from '../../components/article/helpers/css';
import { Arrow } from '../../components/icons/Arrow';
import { families } from '../../theme/typography';

const styles = StyleSheet.create({
	captionWrapper: {
		fontFamily: families.text.regular,
		position: 'absolute',
		zIndex: 1,
		opacity: 0.8,
		backgroundColor: themeColors(ArticleTheme.Dark).background,
		bottom: 0,
		width: '100%',
		padding: 10,
	},
	captionText: {
		color: themeColors(ArticleTheme.Dark).text,
		paddingLeft: 2,
		paddingRight: 13,
	},
	caption: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingBottom: 50,
	},
});

const captionStyleSheet = (pillarColor: string) => ({
	span: {
		fontFamily: families.sans.regular,
		color: themeColors(ArticleTheme.Dark).text,
		fontSize: Platform.OS === 'android' ? 16 : 14,
	},
	b: {
		fontFamily: families.sans.bold,
		color: themeColors(ArticleTheme.Dark).text,
	},
	strong: {
		fontFamily: families.sans.bold,
		color: themeColors(ArticleTheme.Dark).text,
		paddingLeft: 12,
	},
	a: {
		color: pillarColor,
		textDecoration: 'underline',
	},
	em: {
		fontFamily: families.sans.regularItalic,
	},
});

const LightboxCaption = ({
	caption,
	pillarColor,
	displayCredit,
	credit,
}: {
	caption: string;
	pillarColor: string;
	displayCredit?: boolean;
	credit?: string;
}) => {
	const captionText = () => {
		if (displayCredit === true && credit) {
			return caption + ' ' + credit;
		} else {
			return caption;
		}
	};

	const captionStyles = captionStyleSheet(pillarColor);
	const captionSource = { html: `<span>${captionText()}</span>` };
	console.log(captionStyles);
	console.log(captionSource);

	return (
		<View style={styles.captionWrapper}>
			<View style={styles.caption}>
				{caption.length > 1 && (
					<Arrow
						fill={pillarColor}
						direction={Direction.top}
						marginTop={Platform.OS === 'android' ? 10 : 4}
					/>
				)}
				<View style={styles.captionText}>
					<RenderHtml
						source={captionSource}
						tagsStyles={captionStyles}
					/>
				</View>
			</View>
		</View>
	);
};

export { LightboxCaption };
