import type { CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SignInFailedProps } from 'src/components/Modals/SignInFailedModal';
import type {
	ArticleNavigationProps,
	IssueNavigationProps,
	LightboxNavigationProps,
} from './helpers/base';

export type RootStackParamList = {
	Home: undefined;
};

export type OnboardingStackParamList = {
	OnboardingConsent: undefined;
	PrivacyPolicyInline: undefined;
	OnboardingConsentInline: undefined;
};

export type MainStackParamList = {
	Home: undefined;
	Issue: IssueNavigationProps;
	Article: ArticleNavigationProps;
	IssueList: undefined;
	EditionsMenu: undefined;
	Lightbox: LightboxNavigationProps;
	Crossword: ArticleNavigationProps;
	ExternalSubscription: undefined;
	SubNotFoundModal: undefined;
	SignInModal: undefined;
	SubFoundModal: undefined;
	SignInFailedModal: SignInFailedProps;
	MissingIAPRestoreError: undefined;
	MissingIAPRestoreMissing: undefined;
	Settings: { screen: RouteNames };
	Endpoints: undefined;
	Edition: undefined;
	GdprConsent: undefined;
	PrivacyPolicy: undefined;
	TermsAndConditions: undefined;
	BetaProgrammeFAQs: undefined;
	Help: undefined;
	ManageEditions: undefined;
	Credits: undefined;
	FAQ: undefined;
	AlreadySubscribed: undefined;
	SubscriptionDetails: undefined;
	CasSignIn: undefined;
	SignIn: undefined;
	WeatherGeolocationConsent: undefined;
	DevZone: undefined;
	InAppPurchase: undefined;
	ManageEditionsFromSettings: undefined;
};

// This is used on pages which include both main and root stacks
export type CompositeNavigationStackProps = CompositeNavigationProp<
	StackNavigationProp<MainStackParamList>,
	StackNavigationProp<OnboardingStackParamList>
>;

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
	Credits = 'Credits',
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
