import { useNavigation } from '@react-navigation/core';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Button, ButtonAppearance } from '../../components/Button/Button';
import { Header } from '../../components/layout/header/header';
import { SlideCard } from '../../components/layout/slide-card/index';
import { ArticleScreen } from '../../screens/article-screen';
import type { MainStackParamList } from '../NavigationModels';

const FullScreenArticle = () => {
	const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
	return (
		<>
			<Header
				theme="light"
				leftAction={
					<Button
						appearance={ButtonAppearance.Skeleton}
						icon={'\uE00A'}
						alt="Back"
						onPress={() => navigation.goBack()}
					></Button>
				}
				layout="center"
			>
				{null}
			</Header>
			<ArticleScreen />
		</>
	);
};

export const ArticleWrapper = () => {
	const route = useRoute<RouteProp<MainStackParamList, 'Article'>>();
	return route.params.prefersFullScreen ? (
		<FullScreenArticle />
	) : (
		<SlideCard>
			<ArticleScreen />
		</SlideCard>
	);
};
