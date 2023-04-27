type AnalyticsUserId = string | null;

type AnalyticsEvent = {
	name: string;
	value: string;
};

enum AnalyticsScreenTracking {
	AlreadySubscribed = 'im_already_subscribed',
	CasSignIn = 'activate_with_subscriber_id',
	Credits = 'credits',
	Help = 'help',
	FAQ = 'faqs',
	GDPRConsent = 'consent_management_options',
	GdprConsentScreenForOnboarding = 'consent_management',
	IssueList = 'issue_list',
	PrivacyPolicy = 'privacy_policy',
	Settings = 'settings',
	SignIn = 'sign_in',
	TermsAndConditions = 'terms_conditions',
}

export { AnalyticsUserId, AnalyticsEvent, AnalyticsScreenTracking };
