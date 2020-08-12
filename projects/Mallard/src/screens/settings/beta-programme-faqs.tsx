import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'
import { BETA_PROGRAMME_FAQ_HEADER_TITLE } from 'src/helpers/words'
import { html } from 'src/helpers/webview'

const betaProgrammeFAQsHtml = html`
<h2><strong>What is the Daily beta app?</strong></h2>

<p>
    Thank you for being one of the first to try the new Guardian Daily (beta) app. Unlike the current Daily Edition for iPad, you’ll be able to use the new Daily app on almost any Android and iOS device, including your mobile. It’s been redesigned to make the navigation smoother and easier.
    We are keen to receive feedback on your experience using the app and you can report any technical issues by tapping the yellow ‘bug’ button.
    Please note, if you currently access the Daily Edition app with a subscription through Apple, you will only be able to access the Daily beta app on iPad and iPhone. Subscribers to the Guardian Digital pack can access the beta app across both platforms.
</p>


<h2><strong>When will the Daily app replace the existing Daily Edition?</strong></h2>
<p>
    We are currently refining the app and expect to replace the existing Daily Edition over the coming weeks. You will be notified within the app or by email before this happens.
</p>


<h2><strong>How do I supply feedback on the Daily beta?</strong></h2>
<p>
    If you want to report a technical issue:

    <p>1. Tap the ‘bug’ icon on the bottom right of the screen</p>
    <p>2. Choose if you want to include diagnostic information* or not to your email</p>
    <p>3. Describe the steps that led to the bug. Please be as descriptive as possible to help us find and fix the issue</p>
    <p>4. Send the email to our beta team</p>
    


    After sending the email, you will receive an email confirmation shortly afterwards.

    <p>
    <em>*The diagnostic information will help us to detect the issues faster. It tells us about your app version, device and subscription types.</em>
    </p>

    If you want to comment on your experience or suggest a feature:

        <p>1. Tap the yellow drop-down icon on the top right of the app</p>
        <p>2. Tap the Settings icon on the top left</p>
        <p>3. Select Help</p>
        <p>4. Tap on Send feedback to open an email</p>
        <p>5. Choose if you want to include diagnostic information* or not to your email</p>
        <p>6. Send the email to our beta team</p>
    After sending the email, you will receive an email confirmation shortly.

    <p><em>*The diagnostic information tell us about your app version, device and subscription types.</em></p>
</p>


<h2><strong>Can I still access the existing Daily Edition now I have downloaded the Daily beta app?</strong></h2>

<p>
    Yes, you can access the existing Daily Edition app. In order to do this you will need to uninstall the beta version and reinstall the Daily Edition from the Apple App Store.
</p>

<h2><strong>Which devices is the Daily beta app available on?</strong></h2>

<p>
    The Daily beta app is available on any iPhone and iPad running iOS version 10 or later, and any Android phone or tablet running Android version 5 (lollipop) or later.
</p>

<h2><strong>Can I access the Daily beta app on more than one device?</strong></h2>
<p>
    If you are a Guardian Digital subscriber, you can access on up to 10 devices on either Apple or Android operating systems. If you subscribe to the Daily Edition app directly with Apple, you can access on up to 10 iPad and iPhone devices only.
</p>
`

export const BetaProgrammeFAQsScreen = () => (
    <DefaultInfoTextWebview html={betaProgrammeFAQsHtml} />
)

BetaProgrammeFAQsScreen.navigationOptions = {
    title: BETA_PROGRAMME_FAQ_HEADER_TITLE,
}
