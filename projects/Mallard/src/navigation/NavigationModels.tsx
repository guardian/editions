import type {
	ArticleNavigationProps,
	IssueNavigationProps,
	LightboxNavigationProps,
} from './helpers/base';

export type RootStackParamList = {
	Home: undefined;
	Issue: IssueNavigationProps;
	Article: ArticleNavigationProps;
	IssueList: undefined;
	Settings: undefined;
	Endpoints: undefined;
	Edition: undefined;
	GdprConsent: undefined;
	PrivacyPolicy: undefined;
	TermsAndConditions: undefined;
	BetaProgrammeFAQs: undefined;
	Help: undefined;
	ManageEditions: undefined;
	ManageEditionsSettings: undefined;
	Credits: undefined;
	FAQ: undefined;
	AlreadySubscribed: undefined;
	SubscriptionDetails: undefined;
	SignIn: undefined;
	CasSignIn: undefined;
	WeatherGeolocationConsent: undefined;
	Lightbox: LightboxNavigationProps;
	Storybook: undefined;
	EditionsMenu: undefined;
	OnboardingConsent: undefined;
	PrivacyPolicyInline: undefined;
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
	ManageEditionsSettings = 'ManageEditionsSettings',
	Credits = 'Credits',
	FAQ = 'FAQ',
	AlreadySubscribed = 'AlreadySubscribed',
	SubscriptionDetails = 'SubscriptionDetails',
	SignIn = 'SignIn',
	CasSignIn = 'CasSignIn',
	WeatherGeolocationConsent = 'WeatherGeolocationConsent',
	Lightbox = 'Lightbox',
	Storybook = 'Storybook',
	EditionsMenu = 'EditionsMenu',
	OnboardingConsent = 'OnboardingConsent',
	PrivacyPolicyInline = 'PrivacyPolicyInline',
	OnboardingConsentInline = 'OnboardingConsentInline',
}
