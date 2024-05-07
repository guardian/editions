import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ArticlePillar } from '../../common';
import { articlePillars, ArticleType } from '../../common';
import { Button, ButtonAppearance } from '../../components/Button/Button';
import { metrics } from '../../theme/spacing';

const getFirstLast = (arr: any[]): any[] => [arr[0], arr.slice(-1)[0]];

const styles = StyleSheet.create({
	devTools: {
		position: 'absolute',
		zIndex: 9999,
		elevation: 999,
		top: metrics.vertical,
		right: metrics.horizontal,
		alignItems: 'flex-end',
	},
});

export const DevTools = ({
	pillar,
	type,
	setPillar,
	setType,
}: {
	pillar: ArticlePillar;
	type: ArticleType;
	setPillar: (p: (p: ArticlePillar) => ArticlePillar) => void;
	setType: (t: (t: ArticleType) => ArticleType) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [firstPillar, lastPillar] = getFirstLast(
		articlePillars as unknown as ArticlePillar[],
	);
	const types: ArticleType[] = Object.values(ArticleType);
	const [firstType, lastType] = getFirstLast(types);

	return (
		<View style={styles.devTools}>
			<Button
				appearance={ButtonAppearance.SkeletonActive}
				alt={'open devtools'}
				style={{ transform: [{ scale: 0.5 }] }}
				onPress={() => {
					setOpen((current) => !current);
				}}
			>
				{`🌈`}
			</Button>
			{open && (
				<>
					<Button
						style={{ marginTop: metrics.vertical }}
						onPress={() => {
							setPillar((cur) => {
								if (cur === lastPillar) {
									return firstPillar;
								}
								return articlePillars[
									articlePillars.indexOf(cur) + 1
								];
							});
						}}
					>
						{`PILLAR: ${pillar}`}
					</Button>
					<View
						style={{
							marginTop: metrics.vertical,
							flexDirection: 'row',
						}}
					>
						<Button
							onPress={() => {
								setType((cur) => {
									if (cur === firstType) {
										return lastType;
									}
									return types[types.indexOf(cur) - 1];
								});
							}}
						>
							{`👈 ${type}`}
						</Button>
						<Button
							style={{ marginLeft: metrics.horizontal / 4 }}
							onPress={() => {
								setType((cur) => {
									if (cur === lastType) {
										return firstType;
									}
									return types[types.indexOf(cur) + 1];
								});
							}}
						>
							{`👉`}
						</Button>
					</View>
				</>
			)}
		</View>
	);
};
