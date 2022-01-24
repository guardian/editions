import { MessageKind, Platform as PlatformType } from '@guardian/renditions';
import type {
	LightboxMessage,
	PlatformMessage,
	ShareIconMessage,
} from '@guardian/renditions';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { PixelRatio, Platform, Share, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type WebView from 'react-native-webview';
import type {
	Article as ArticleT,
	GalleryArticle,
	Image,
	PictureArticle,
} from 'src/common';
import {
	defaultSettings,
	htmlEndpoint,
	isPreview,
} from 'src/helpers/settings/defaults';
import { parsePing } from 'src/helpers/webview';
import { useArticle } from 'src/hooks/use-article';
import { useApiUrl } from 'src/hooks/use-config-provider';
import { selectImagePath } from 'src/hooks/use-image-paths';
import { useIssueSummary } from 'src/hooks/use-issue-summary-provider';
import { useNetInfo } from 'src/hooks/use-net-info-provider';
import { RouteNames } from 'src/navigation/NavigationModels';
import type { PathToArticle } from 'src/paths';
import { remoteConfigService } from 'src/services/remote-config';
import { metrics } from 'src/theme/spacing';
import type {
	BlockElement,
	CreditedImage,
	ImageElement,
	IssueOrigin,
} from '../../../../../Apps/common/src';
import { Fader } from '../../layout/animators/fader';
import { isSuccessOrRedirect } from './article/helpers';
import { WebviewWithArticle } from './article/webview';

const styles = StyleSheet.create({
	block: {
		alignItems: 'flex-start',
		padding: metrics.horizontal,
		paddingVertical: metrics.vertical,
	},
	webviewWrap: {
		...StyleSheet.absoluteFillObject,
	},
	webview: {
		flex: 1,
		overflow: 'hidden',
		marginTop: 52,
		/*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        Bug is only in Android 9
        */
		opacity:
			DeviceInfo.getSystemVersion() === '9.0' && Platform.OS === 'android'
				? 0.99
				: 1,
	},
});

export type HeaderControlInnerProps = {
	/**
	 * Called when the user scrolled up or down sufficiently that we want to
	 * auto-hide the article header (slider, navbar...), or show it again.
	 */
	onShouldShowHeaderChange: (shouldShowHeader: boolean) => void;
	/**
	 * Whether the header is shown right now.
	 */
	shouldShowHeader: boolean;
	/**
	 * A padding, in points/pixel, which should added at the very top of the
	 * article so that it accomodates the header that will be shown with
	 * absolute positionning on top of it.
	 */
	topPadding: number;
};

export type HeaderControlProps = HeaderControlInnerProps & {
	/**
	 * Called when we changed from being at the top to being in the middle of
	 * the article.
	 */
	onIsAtTopChange: (isAtTop: boolean) => void;
};
const getLightboxImages = (elements: BlockElement[]): ImageElement[] => {
	const images: ImageElement[] = elements.filter(
		(e: BlockElement): e is ImageElement => e.id === 'image',
	);
	return images;
};

const getCreditedImages = (elements: ImageElement[]): CreditedImage[] => {
	const creditedImages: CreditedImage[] = elements.map((e) => {
		return {
			source: e.src.source,
			path: e.src.path,
			role: e.src.role,
			credit: e.credit,
			caption: e.caption,
			displayCredit: e.displayCredit,
		};
	});
	return creditedImages;
};

/**
 * This takes care of updating the value of a global *within* the web
 * view. Since the API is imperative, we cannot pass this as a "prop" to the
 * JavaScript inside the webview. So instead we pass it imperatively when the
 * value changes. We try to minimize communication for perf. so we don't need to
 * do anything if the value changed because the webview itself communicated us a
 * change in the first place; it has the right value already.
 */
const useUpdateWebviewVariable = (
	webviewRef: React.MutableRefObject<WebView | null>,
	name: string,
	value: boolean,
) => {
	const valueInWebview = useRef(true);
	useEffect(() => {
		if (webviewRef.current == null) return;
		if (value === valueInWebview.current) return;
		valueInWebview.current = value;
		webviewRef.current.injectJavaScript(`window.${name} = ${value};`);
	}, [value]);
	return valueInWebview;
};

const injectJavascript = (
	webviewRef: React.MutableRefObject<WebView | null>,
	script: string,
): void => {
	if (webviewRef?.current) {
		webviewRef.current.injectJavaScript(script);
	}
};

/**
 * Sometimes the webUrl is empty due to that content not being published at the point the edition
 * was created. However, we still have access to the article path at the time of publication
 * This function checks to see if theguardian.com/<path at publication time> exists
 */
const checkPathExists = async (articlePath: string) => {
	const generatedUrl = `${defaultSettings.websiteUrl}${articlePath}`;
	// HEAD request as we only need the status code. If the request fails return null
	const dotComResult = await fetch(`${generatedUrl}`, {
		method: 'HEAD',
	}).catch(() => null);

	return dotComResult && isSuccessOrRedirect(dotComResult.status)
		? generatedUrl
		: null;
};

const Article = ({
	article,
	path,
	onShouldShowHeaderChange,
	shouldShowHeader,
	onIsAtTopChange,
	origin,
}: {
	article: ArticleT | PictureArticle | GalleryArticle;
	path: PathToArticle;
	origin: IssueOrigin;
} & HeaderControlProps) => {
	const navigation = useNavigation();
	const ref = useRef<WebView | null>(null);
	const [script, setScript] = useState('');
	const [imagePaths, setImagePaths] = useState(['']);
	const [lightboxImages, setLightboxImages] = useState<CreditedImage[]>();

	const wasShowingHeader = useUpdateWebviewVariable(
		ref,
		'shouldShowHeader',
		shouldShowHeader,
	);
	const lightboxEnabled = remoteConfigService.getBoolean('lightbox_enabled');

	const [, { pillar }] = useArticle();
	const { apiUrl } = useApiUrl();
	const { issueId } = useIssueSummary();
	const { front, publishedIssueId } = path;
	const htmlFolderInS3 = htmlEndpoint(apiUrl, publishedIssueId);
	const previewParam = isPreview(apiUrl) ? `?frontId=${front}` : '';

	// if webUrl is undefined then we attempt to fetch a url to use for sharing
	const [shareUrl, setShareUrl] = useState(article.webUrl ?? '');
	const { isConnected } = useNetInfo();

	useEffect(() => {
		const lbimages = getLightboxImages(article.elements);
		const lbCreditedImages = getCreditedImages(lbimages);
		// to avoid image duplication we don't add the main image of gallery articles to the array
		if (article.type !== 'gallery' && article.image) {
			lbCreditedImages.unshift(article.image);
		}
		setLightboxImages(lbCreditedImages);
		const getImagePathFromImage = async (image: Image) => {
			if (issueId && image) {
				const { localIssueId, publishedIssueId } = issueId;
				const imagePath = await selectImagePath(
					apiUrl,
					localIssueId,
					publishedIssueId,
					image,
					'full-size',
				);
				return imagePath;
			}
			return '';
		};
		const fetchImagePaths = async () => {
			return await Promise.all(
				lbCreditedImages.map((image) => getImagePathFromImage(image)),
			);
		};
		fetchImagePaths().then((imagePaths) => setImagePaths(imagePaths));

		const updateShareUrl = async () => {
			const url = await checkPathExists(article.key);
			setShareUrl(url ?? '');
		};

		isConnected && updateShareUrl();
	}, [
		apiUrl,
		article.elements,
		issueId,
		article.image,
		article.type,
		article.key,
		isConnected,
	]);

	// This is triggered when the script is updated via handlePlatformQuery
	// which itself is trigger by a ping from Editions-Rendering to signify
	// that the event listeners in ER are in place.
	// The injected js controls the shareIcon icon and will not render if
	// an article has no webUrl
	useEffect(() => {
		if (ref) {
			injectJavascript(ref, script);
		}
	}, [script]);

	const handleShare = (shareUrl: string) => {
		if (Platform.OS === 'ios') {
			Share.share({
				url: shareUrl,
				message: article.headline,
			});
		} else {
			Share.share(
				{
					title: article.headline,
					url: shareUrl,
					// 'message' is required as well as 'url' to support wide range of clients (e.g. email/whatsapp etc)
					message: shareUrl,
				},
				{
					subject: article.headline,
				},
			);
		}
		return;
	};

	const isGalleryHeaderImage = (parsed: LightboxMessage) =>
		article.type === 'gallery' && parsed.isMainImage;

	const isGalleryBodyImage = (index: number) =>
		article.type === 'gallery' && index !== 0;

	const handleLightbox = (parsed: LightboxMessage) => {
		// Gallery header images should not open the lightbox.
		if (isGalleryHeaderImage(parsed)) return;

		let index = parsed.index;
		// Gallery body images have the the wrong index because the main media is duplicated and assumed index 0. To fix this, body images need to have their index reduced by 1.
		if (isGalleryBodyImage(index)) index--;

		navigation.navigate(RouteNames.Lightbox, {
			images: lightboxImages,
			imagePaths: imagePaths,
			index,
			pillar,
		});
	};

	const handlePlatformQuery = (shareUrl: string): void => {
		const getPlatformMessage = (): PlatformMessage => {
			const value =
				Platform.OS === 'ios' ? PlatformType.IOS : PlatformType.Android;
			return { kind: MessageKind.Platform, value };
		};

		const getShareMessage = (shareUrl: string): ShareIconMessage => {
			return { kind: MessageKind.ShareIcon, value: shareUrl };
		};

		const pingEditionsRenderingJsString = (
			platformMessage: PlatformMessage,
			shareIconMessage: ShareIconMessage,
		) => {
			const scale = PixelRatio.getFontScale();
			const lineHeight = 25 * scale;
			const fontSize = 17 * scale;

			return `
                try {
                    let bodyContent = document.querySelectorAll(".body-content > p");
                    for(i = 0; i < bodyContent.length; i++) {
                        bodyContent[i].style.setProperty("font-size", "${fontSize}px");
                        bodyContent[i].style.setProperty("line-height", "${lineHeight}px");

                    }
                    window.pingEditionsRendering(${JSON.stringify(
						shareIconMessage,
					)})
                    window.pingEditionsRendering(${JSON.stringify(
						platformMessage,
					)})
                } catch {
                    console.error("Editions -> Editions Rendering not initiated")
                }
        `;
		};

		const platform = getPlatformMessage();
		const share = getShareMessage(shareUrl);
		const platformScript = pingEditionsRenderingJsString(platform, share);

		setScript(platformScript);
	};

	const handlePing = (event: string) => {
		const parsed = parsePing(event);
		if (parsed.kind === MessageKind.Share && shareUrl) {
			handleShare(shareUrl);
		}

		if (parsed.kind === 'shouldShowHeaderChange') {
			wasShowingHeader.current = parsed.shouldShowHeader;
			onShouldShowHeaderChange(parsed.shouldShowHeader);
		}

		if (parsed.kind === 'isAtTopChange') {
			onIsAtTopChange(parsed.isAtTop);
		}

		if (lightboxEnabled && parsed.kind === MessageKind.Lightbox) {
			handleLightbox(parsed);
		}

		if (parsed.kind === MessageKind.PlatformQuery) {
			handlePlatformQuery(shareUrl);
		}
	};

	return (
		<Fader>
			<WebviewWithArticle
				article={article}
				path={path}
				previewParam={previewParam}
				htmlFolderInS3={htmlFolderInS3}
				scrollEnabled={true}
				allowsInlineMediaPlayback={true} // need this along with `mediaPlaybackRequiresUserAction = false` to ensure videos in twitter embeds play on iOS
				mediaPlaybackRequiresUserAction={false}
				style={[styles.webview]}
				_ref={(r) => {
					ref.current = r;
				}}
				origin={origin}
				onMessage={(event) => {
					handlePing(event.nativeEvent.data);
				}}
				decelerationRate={'normal'}
			/>
		</Fader>
	);
};

export { Article };
