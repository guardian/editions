import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Appearance } from 'src/common';
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message';
import { LoginOverlay } from 'src/components/login/login-overlay';
import { ERR_404_MISSING_PROPS } from 'src/helpers/words';
import { getAppearancePillar } from 'src/hooks/use-article';
import { useDimensions } from 'src/hooks/use-config-provider';
import type { ArticleNavigationProps } from 'src/navigation/helpers/base';
import { getArticleNavigationProps } from 'src/navigation/helpers/base';
import type { MainStackParamList } from 'src/navigation/NavigationModels';
import { RouteNames } from 'src/navigation/NavigationModels';
import type { PathToArticle } from 'src/paths';
import { color } from 'src/theme/color';
import { getArticleDataFromNavigator } from './article-screen-utils';
import { ArticleScreenBody } from './article/body';
import { ArticleSlider } from './article/slider';

export type FrontSpec = {
	frontName: string;
	appearance: Appearance;
	articleSpecs: PathToArticle[];
};

export type ArticleNavigator = FrontSpec[];

const ArticleScreenLoginOverlay = ({ children }: { children: ReactNode }) => {
	const navigation = useNavigation();
	return (
		<LoginOverlay
			isFocused={() => navigation.isFocused()}
			onLoginPress={() =>
				navigation.navigate(RouteNames.Settings, {
					screen: RouteNames.SignIn,
				})
			}
			onOpenCASLogin={() =>
				navigation.navigate(RouteNames.Settings, {
					screen: RouteNames.CasSignIn,
				})
			}
			onDismiss={() => navigation.goBack()}
		>
			{children}
		</LoginOverlay>
	);
};

const styles = StyleSheet.create({
	refView: { flex: 1 },
});

const ArticleScreenWithProps = ({
	path,
	articleNavigator,
	prefersFullScreen,
}: Required<ArticleNavigationProps> & {}) => {
	const current = getArticleDataFromNavigator(articleNavigator, path);
	// TODO use `getData` for this
	const pillar = getAppearancePillar(current.appearance);
	const viewRef = useRef<View>();
	const { width } = useDimensions();
	useEffect(() => {
		if (viewRef.current) {
			viewRef.current.setNativeProps({ opacity: 0 });
			setTimeout(() => {
				viewRef?.current?.setNativeProps({ opacity: 1 });
			}, 600);
		}
	}, [width]);
	return (
		<ArticleScreenLoginOverlay>
			<View
				style={styles.refView}
				ref={(r) => {
					if (r) viewRef.current = r;
				}}
			>
				{prefersFullScreen ? (
					<>
						<ArticleScreenBody
							path={path}
							width={width}
							pillar={pillar}
							onShouldShowHeaderChange={() => {}}
							shouldShowHeader={true}
							topPadding={0}
						/>
					</>
				) : (
					<ArticleSlider
						path={path}
						articleNavigator={articleNavigator}
					/>
				)}
			</View>
		</ArticleScreenLoginOverlay>
	);
};

export const ArticleScreen = () => {
	const route = useRoute<RouteProp<MainStackParamList, 'Article'>>();
	return getArticleNavigationProps(route.params, {
		error: () => (
			<FlexErrorMessage
				title={ERR_404_MISSING_PROPS}
				style={{ backgroundColor: color.background }}
			/>
		),
		success: (props) => {
			return <ArticleScreenWithProps {...props} />;
		},
	});
};
