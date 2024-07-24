import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { HeaderScreenContainer } from '../../components/Header/Header';
import { ScrollContainer } from '../../components/layout/ui/container';
import { Heading } from '../../components/layout/ui/row';
import { List } from '../../components/lists/list';
import { EDITIONS_HEADER_TITLE } from '../../helpers/words';
import { useEditions } from '../../hooks/use-edition-provider';
import type { MainStackParamList } from '../../navigation/NavigationModels';

const EditionsScreen = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<MainStackParamList>>();
	const { editionsList, storeSelectedEdition } = useEditions();

	const consolidatedEditions = [
		...editionsList.regionalEditions,
		...editionsList.specialEditions,
	];

	return (
		<HeaderScreenContainer title={EDITIONS_HEADER_TITLE} actionLeft={true}>
			<ScrollContainer>
				<Heading>Presets</Heading>
				<List
					data={consolidatedEditions.map((edition) => ({
						title: edition.title,
						key: edition.title,
						data: consolidatedEditions,
						onPress: () => {
							storeSelectedEdition(edition);
							navigation.goBack();
						},
					}))}
				/>
			</ScrollContainer>
		</HeaderScreenContainer>
	);
};

export { EditionsScreen };
