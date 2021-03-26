import type { CompositeNavigationProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import type {
	ArticleNavigationProps,
	IssueNavigationProps,
	LightboxNavigationProps,
} from './helpers/base';

export type RootStackParamList = {
	Home: undefined;
	Settings: undefined;
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
	Storybook: undefined;
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
	SignIn: undefined;
	EditionsMenu: undefined;
	WeatherGeolocationConsent: undefined;
	Lightbox: LightboxNavigationProps;
};

// This is used on pages which include both main and root stacks
export type CompositeNavigationStackProps = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList>,
	StackNavigationProp<MainStackParamList>
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
