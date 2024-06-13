import type { SignInFailedProps } from 'src/components/Modals/SignInFailedModal';
import type {
	ArticleNavigationProps,
	IssueNavigationProps,
	LightboxNavigationProps,
} from './helpers/base';

type SubFoundModalProps = {
	closeAction?: () => void;
};

export type RootStackParamList = {
	Home: undefined;
};

export type MainStackParamList = {
	Home: undefined;
	Issue: IssueNavigationProps | undefined;
	Article: ArticleNavigationProps;
	IssueList: undefined;
	EditionsMenu: undefined;
	Lightbox: LightboxNavigationProps;
	Crossword: ArticleNavigationProps;
	ExternalSubscription: undefined;
	SubNotFoundModal: undefined;
	SignInModal: undefined;
	SubFoundModal: SubFoundModalProps | undefined;
	SignInFailedModal: SignInFailedProps;
	MissingIAPRestoreError: undefined;
	MissingIAPRestoreMissing: undefined;
	Settings: { screen: RouteNames } | undefined;
	Endpoints: undefined;
	Edition: undefined;
	GdprConsent: undefined;
	PrivacyPolicy: undefined;
	TermsAndConditions: undefined;
	BetaProgrammeFAQs: undefined;
	Help: undefined;
	ManageEditions: undefined;
	FAQ: undefined;
	AlreadySubscribed: undefined;
	SubscriptionDetails: undefined;
	CasSignIn: undefined;
	SignIn: undefined;
	WeatherGeolocationConsent: undefined;
	DevZone: undefined;
	InAppPurchase: undefined;
	ManageEditionsFromSettings: undefined;
	OnboardingConsent: undefined;
	PrivacyPolicyInline: undefined;
	OnboardingConsentInline: undefined;
};

export enum RouteNames {
	Home = 'Home',
	Issue = 'Issue',
	Article = 'Article',
	IssueList = 'IssueList',
	Settings = 'Settings',
	Endpoints = 'Endpoints',
	Edition = 'Edition',
	GdprConsent = 'GdprConsent',
	PrivacyPolicy = 'PrivacyPolicy',
	TermsAndConditions = 'TermsAndConditions',
	BetaProgrammeFAQs = 'BetaProgrammeFAQs',
	Help = 'Help',
	ManageEditions = 'ManageEditions',
	FAQ = 'FAQ',
	AlreadySubscribed = 'AlreadySubscribed',
	SubscriptionDetails = 'SubscriptionDetails',
	CasSignIn = 'CasSignIn',
	WeatherGeolocationConsent = 'WeatherGeolocationConsent',
	Lightbox = 'Lightbox',
	EditionsMenu = 'EditionsMenu',
	OnboardingConsent = 'OnboardingConsent',
	PrivacyPolicyInline = 'PrivacyPolicyInline',
	OnboardingConsentInline = 'OnboardingConsentInline',
	Crossword = 'Crossword',
	DevZone = 'DevZone',
	InAppPurchase = 'InAppPurchase',
	ExternalSubscription = 'ExternalSubscription',
	SubNotFoundModal = 'SubNotFoundModal',
	SignInModal = 'SignInModal',
	SubFoundModal = 'SubFoundModal',
	SignInFailedModal = 'SignInFailedModal',
	MissingIAPRestoreError = 'MissingIAPRestoreError',
	MissingIAPRestoreMissing = 'MissingIAPRestoreMissing',
	ManageEditionsFromSettings = 'ManageEditionsFromSettings',
}
