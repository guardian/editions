import React, { useState } from 'react';
import { Platform } from 'react-native';
import type { WebViewProps } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import type {
	Article,
	GalleryArticle,
	IssueOrigin,
	PictureArticle,
} from 'src/common';
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider';
import { useNetInfo } from 'src/hooks/use-net-info-provider';
import type { PathToArticle } from 'src/paths';
import { FSPaths } from 'src/paths';
import WebviewError from 'src/screens/webview-error-screen';
import { onShouldStartLoadWithRequest } from './helpers';

const WebviewWithArticle = ({
	article,
	path,
	previewParam,
	htmlFolderInS3,
	_ref,
	origin,
	...webViewProps
}: {
	article: Article | PictureArticle | GalleryArticle;
	path: PathToArticle;
	previewParam: string;
	htmlFolderInS3: string;
	_ref?: (ref: WebView) => void;
	origin: IssueOrigin;
} & WebViewProps & { onScroll?: any }) => {
	const { localIssueId } = path;
	const largeDeviceMemory = useLargeDeviceMemory();
	const [isReady, setIsReady] = useState(false);
	const { isConnected } = useNetInfo();

	const updateSource = () => {
		// On Android there is a potential race condition where url did get set before
		// webview file system permission did get set and as result local html file fails to load
		// within the webview.
		// Github issue: https://github.com/react-native-webview/react-native-webview/issues/656#issuecomment-551312436
		setIsReady(true);
	};

	// Online: Url to load direct from s3 (when bundle is not downloaded)
	// When app runs in Preview Mode the url points to backend and backend needs to know
	// which front the articles belongs to properly render an article with correct overrides from the fronts tool
	let uri = `${htmlFolderInS3}/${article.internalPageCode}.html${previewParam}`;

	// Offline/Downloaded: load from file system
	if (origin === 'filesystem') {
		const htmlUri = `${FSPaths.issueRoot(localIssueId)}/html/${
			article.internalPageCode
		}.html`;
		uri = Platform.OS === 'android' ? 'file://' + htmlUri : htmlUri;
	}

	console.log(`URL (${origin}): ${uri}`);

	// if the device is offline and the Issue is not downloaded show a user friendly error message
	if (!isConnected && origin == 'api') return <WebviewError />;

	return (
		<WebView
			{...webViewProps}
			bounces={largeDeviceMemory ? true : false}
			originWhitelist={['*']}
			scrollEnabled={true}
			source={isReady ? { uri: uri } : undefined}
			ref={_ref}
			onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
			allowFileAccess={true}
			allowUniversalAccessFromFileURLs={true}
			allowingReadAccessToURL={FSPaths.issuesDir}
			cacheEnabled={false}
			cacheMode={'LOAD_NO_CACHE'}
			onLoadStart={() => {
				updateSource();
			}}
		/>
	);
};

export { WebviewWithArticle };
