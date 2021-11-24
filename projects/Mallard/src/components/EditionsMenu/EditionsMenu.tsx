import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import type { EditionId, RegionalEdition, SpecialEdition } from 'src/common';
import { metrics } from 'src/theme/spacing';
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults';
import { EditionButton } from './EditionButton/EditionButton';
import { ItemSeperator } from './ItemSeperator/ItemSeperator';

const styles = StyleSheet.create({
	container: {
		paddingTop: 17,
		paddingHorizontal: metrics.horizontal,
		height: Dimensions.get('window').height,
	},
});

const EditionsMenu = ({
	navigationPress,
	regionalEditions,
	selectedEdition,
	specialEditions,
	storeSelectedEdition,
}: {
	navigationPress: () => void;
	regionalEditions?: RegionalEdition[];
	selectedEdition: EditionId;
	specialEditions?: SpecialEdition[];
	storeSelectedEdition: (
		chosenEdition: RegionalEdition | SpecialEdition,
	) => void;
}) => {
	const renderRegionalItem = ({ item }: { item: RegionalEdition }) => {
		const handlePress = () => {
			storeSelectedEdition(item);
			navigationPress();
		};
		const isSelected = selectedEdition === item.edition ? true : false;

		return (
			<EditionButton
				selected={isSelected}
				onPress={handlePress}
				title={item.title}
				subTitle={item.subTitle}
			/>
		);
	};

	const renderSpecialItem = ({ item }: { item: SpecialEdition }) => {
		const { buttonStyle, buttonImageUri, expiry, title, subTitle } = item;
		const handlePress = () => {
			storeSelectedEdition(item);
			navigationPress();
		};

		const isSelected = selectedEdition === item.edition ? true : false;

		return (
			<EditionButton
				title={title}
				subTitle={subTitle}
				imageUri={buttonImageUri}
				expiry={new Date(expiry)}
				titleColor={buttonStyle.backgroundColor}
				selected={isSelected}
				onPress={handlePress}
				isSpecial
			/>
		);
	};

	const renderItem = ({
		item,
	}: {
		item: RegionalEdition | SpecialEdition;
	}) => {
		if (item.editionType === 'Regional') {
			return renderRegionalItem({ item } as { item: RegionalEdition });
		}
		return renderSpecialItem({ item } as { item: SpecialEdition });
	};

	const menuItems = [
		...(regionalEditions ?? defaultRegionalEditions),
		...(specialEditions ?? []),
	];

	return (
		<FlatList
			style={styles.container}
			data={menuItems}
			renderItem={renderItem}
			ItemSeparatorComponent={() => <ItemSeperator />}
		/>
	);
};

export { EditionsMenu };
