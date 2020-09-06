import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'
import { BETA_PROGRAMME_FAQ_HEADER_TITLE } from 'src/helpers/words'
import { html } from 'src/helpers/webview'

const betaProgrammeFAQsHtml = html`
<h1>The Guardian Editions (beta) FAQs</h1>
<p><strong>Contents</strong></p>
<ul>
<li><strong>What is the Editions beta app?</strong></li>
<li><strong>How do I become a beta tester?</strong></li>
<li><strong>How do I supply feedback or report bugs on the Editions beta?</strong></li>
<li><strong>Which devices is the Editions beta app available on?</strong></li>
<li><strong>Can I access the Editions beta app on more than one device?</strong></li>
<li><strong>How can I leave the beta app?</strong></li>
<li><strong>I have a question about my subscription, where can I find more FAQs?</strong></li>
</ul>
<h2>What is the Editions beta app?</h2>
<p>Thank you for your interest in the Guardian Editions beta. The beta version of the Guardian Editions app (current Daily app) provides you access to new developments in the app and also the new Australia Weekend editions.</p>
<p>By joining our beta programme, you&rsquo;ll be helping us deliver the best experience possible by providing early feedback and reporting any bugs that you may encounter in the app. We have a limited number of beta places and your help is invaluable and much appreciated.</p>
<p>Please note, if you currently access the Editions app with a subscription through Apple, you can not redeem your existing subscription within Testflight. Guardian Digital subscribers can access the beta app across both platforms - Android and iOS.</p>
<h2>How do I become a beta tester?</h2>
<p>On iPhone and iPads:</p>
<p>1. Open the following link on your device: <a href="https://testflight.apple.com/join/O2EojUEl">https://testflight.apple.com/join/O2EojUEl</a></p>
<p>2. Download the Testflight app</p>
<p>3. Install the beta version of the Guardian Editions app</p>
<p>4. Once in the Guardian Editions app, sign in with the same email from your Digital subscription. You can sign in by tapping on the yellow menu and accessing the settings screen from the cog icon on the top left corner of the screen</p>
<p>5. Allow notifications so that you can be aware of new updates</p>
<p>On Android phones and tablets:</p>
<p>1. Open the following link on your device: <a href="https://play.google.com/apps/testing/com.guardian.editions">https://play.google.com/apps/testing/com.guardian.editions</a></p>
<p>2. Sign in to your Google account</p>
<p>3. Follow the download instructions on Play Store</p>
<p>4. Once in the Guardian Editions app, sign in with the same email from your Digital subscription. You can sign in by tapping on the yellow menu and accessing the settings screen from the cog icon on the top left corner of the screen</p>
<h2>How to switch between UK and Australia editions?</h2>
<p>Once in the app, you can access the new editions by tapping on the top left corner icon on your home screen.</p>
<h2>How do I supply feedback or report bugs and issues?</h2>
<p>If you want to report a technical issue:</p>
<p>1. Tap the &lsquo;bug&rsquo; icon on the bottom right of the screen</p>
<p>2. Choose if you want to include diagnostic information* or not to your email Describe the steps that led to the bug.</p>
<p>3. Please be as descriptive as possible to help us find and fix the issue</p>
<p>4. Send the email to our beta team. After sending the email, you will receive an email confirmation shortly afterward.</p>
<p><em>*The diagnostic information will help us to detect the issues quicker. It tells us about your app version, device and subscription types.</em></p>
<p>If you want to comment on your experience or suggest a feature, this can be done from the Help section of the Settings menu (accessed via the cog icon).</p>
<h2>Which devices is the Editions beta app available on?</h2>
<p>The Editions beta app is available on any iPhone and iPad running iOS version 12.4 or later, and any Android phone or tablet running Android version 5 (lollipop) or later.</p>
<h2>Can I access the Editions beta app on more than one device?</h2>
<p>If you are a Guardian Digital subscriber, you can access it on up to 10 devices on either Apple or Android operating systems. If you subscribe to the Daily Edition app directly with Apple, the beta app is unavailable at this moment in time.</p>
<h2>How can I leave the beta app?</h2>
<p>You can leave the beta programme at any time.</p>
<p>On iPhone and iPads:</p>
<p>Open the App Store app on your device, search for Guardian Editions app, and download it. It will automatically delete the beta version from Testflight.</p>
<p>On Android phones and tablets:</p>
<p>Open the Google Play app on your device, search for Guardian Editions app, and tap on &lsquo;Leave the program&rsquo;.</p>
`

export const BetaProgrammeFAQsScreen = () => (
    <DefaultInfoTextWebview html={betaProgrammeFAQsHtml} />
)

BetaProgrammeFAQsScreen.navigationOptions = {
    title: BETA_PROGRAMME_FAQ_HEADER_TITLE,
}
