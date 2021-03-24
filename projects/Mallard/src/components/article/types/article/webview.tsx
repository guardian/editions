import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { WebViewProps } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import type {
	Article,
	GalleryArticle,
	IssueOrigin,
	PictureArticle,
} from 'src/common';
import { defaultSettings } from 'src/helpers/settings/defaults';
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider';
import type { PathToArticle } from 'src/paths';
import { FSPaths } from 'src/paths';
import { onShouldStartLoadWithRequest } from './helpers';

const WebviewWithArticle = ({
	article,
	path,
	_ref,
	origin,
	...webViewProps
}: {
	article: Article | PictureArticle | GalleryArticle;
	path: PathToArticle;
	_ref?: (ref: WebView) => void;
	origin: IssueOrigin;
} & WebViewProps & { onScroll?: any }) => {
	const { localIssueId } = path;
	const largeDeviceMemory = useLargeDeviceMemory();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
	}, [isReady]);

	// Online rendering
	let uri = `${defaultSettings.appsRenderingService}${article.internalPageCode}?editions`;

	// Offline rendering
	if (origin === 'filesystem') {
		const htmlUri = `${FSPaths.issueRoot(localIssueId)}/html/${
			article.internalPageCode
		}.html`;
		uri = Platform.OS === 'android' ? 'file://' + htmlUri : htmlUri;
	}

	// set url only when component is ready
	// https://github.com/react-native-webview/react-native-webview/issues/656#issuecomment-551312436
	const finalUrl = isReady ? uri : '';
	console.log('URL: ' + finalUrl);

	return (
		<WebView
			{...webViewProps}
			bounces={largeDeviceMemory ? true : false}
			originWhitelist={['*']}
			scrollEnabled={true}
			source={{ uri: finalUrl }}
			ref={_ref}
			onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
			allowFileAccess={true}
			allowFileAccessFromFileURLs={true}
			allowingReadAccessToURL={FSPaths.issuesDir}
		/>
	);
};

export { WebviewWithArticle };
