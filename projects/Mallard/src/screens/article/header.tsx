import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, ButtonAppearance } from 'src/components/Button/Button';
import { Header } from 'src/components/layout/header/header';

export const BasicArticleHeader = () => {
	const navigation = useNavigation();
	return (
		<Header
			theme="light"
			leftAction={
				<Button
					appearance={ButtonAppearance.skeleton}
					icon={'\uE00A'}
					alt="Back"
					onPress={() => navigation.goBack()}
				></Button>
			}
			layout="center"
		>
			{null}
		</Header>
	);
};
