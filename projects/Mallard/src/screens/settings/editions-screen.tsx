import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { HeaderScreenContainer } from 'src/components/Header/Header';
import { ScrollContainer } from 'src/components/layout/ui/container';
import { Heading } from 'src/components/layout/ui/row';
import { List } from 'src/components/lists/list';
import { EDITIONS_HEADER_TITLE } from 'src/helpers/words';
import { useEditions } from 'src/hooks/use-edition-provider';

const EditionsScreen = () => {
	const navigation = useNavigation();
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
