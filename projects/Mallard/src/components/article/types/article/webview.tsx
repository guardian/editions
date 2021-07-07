import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Platform } from 'react-native';
import type { WebViewProps } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import type {
	Article,
	GalleryArticle,
	IssueOrigin,
	PictureArticle,
} from 'src/common';
import { getSetting } from 'src/helpers/settings';
import { htmlEndpoint, isPreview } from 'src/helpers/settings/defaults';
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider';
import { useIsPreview } from 'src/hooks/use-settings';
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
	const { localIssueId, front } = path;
	const largeDeviceMemory = useLargeDeviceMemory();
	const [isReady, setIsReady] = useState(false);
	const [s3HtmlUrlPrefix, setS3HtmlUrlPrefix] = useState('');
	const [isPreviewMode, setIsPreviewMode] = useState(false);

	useEffect(() => {
		getSetting('apiUrl').then(async (url) => {
			const s3HtmlUrl = htmlEndpoint(url, path.publishedIssueId);
			setS3HtmlUrlPrefix(s3HtmlUrl);
			setIsPreviewMode(isPreview(url))
			setIsReady(true);
		});
	}, [isReady]);

	// Online: Url to load direct from s3 (when bundle is not downloaded)
	// When app runs in Preview Mode the url points to backend and backend needs to know 
	// which front the articles belongs to properly render an article with correct overrides from the fronts tool
	const previewParam = isPreviewMode ? `?frontId=${front}` : '';
	let uri = `${s3HtmlUrlPrefix}/${article.internalPageCode}.html${previewParam}`;

	// Offline/Downloaded: load from file system
	if (origin === 'filesystem') {
		const htmlUri = `${FSPaths.issueRoot(localIssueId)}/html/${
			article.internalPageCode
		}.html`;
		uri = Platform.OS === 'android' ? 'file://' + htmlUri : htmlUri;
	}

	// set url only when component is ready
	// https://github.com/react-native-webview/react-native-webview/issues/656#issuecomment-551312436
	const finalUrl = isReady ? uri : '';

	// returning an empty view instead of setting empty url to the webview that results in showing error msg for a brief period
	if (!isReady) {
		return <View/>;
	}

	console.log(`URL (${origin}): ${finalUrl}`);

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
