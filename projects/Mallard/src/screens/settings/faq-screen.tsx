import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'
import { html } from 'src/helpers/webview'

const faqHtml = html`
    <h1>The Guardian Editions FAQs</h1>
    <h2>Contents</h2>
    <ul>
        <li>What is The Guardian Editions app?</li>
        <li>How do I purchase the Editions app?</li>
        <li>How do I access the Editions app?</li>
        <li>How do I access different Editions within the app?</li>
        <li>Can I access the Editions app on more than one device?</li>
        <li>What time is the latest edition available each day?</li>
        <li>How many days of editions can I access?</li>
        <li>Can I use the Editions app when I&rsquo;m abroad?</li>
        <li>How do I access crosswords?</li>
        <li>Can I access video in the Editions app?</li>
        <li>How do I change the font size?</li>
        <li>Is there a dark mode?</li>
        <li>How do I share content?</li>
        <li>Can I hide the weather?</li>
        <li>Are there versions for regions outside of the UK and Australia?</li>
        <li>
            I used to read the Daily app, how is the new Editions app different?
        </li>
        <li>I have feedback, where should I send it?</li>
        <li>Where can I find out more about my subscription?</li>
    </ul>
    <h2>What is The Guardian Editions app?</h2>
    <p>
        The Editions app includes the UK Daily edition, Australia Weekend and
        other special editions all in one app.
    </p>
    <p>
        <strong>The UK Guardian Daily</strong> brings you the coverage you need
        for the day, giving you a considered alternative to the never-ending
        news feed. Beautifully designed and easy to navigate on mobile and
        tablet, the Daily brings you the stories that matter every morning.
    </p>
    <p>
        The UK Guardian Daily is published daily - each edition available to
        read by 6am (GMT), 7 days a week
    </p>
    <p>
        <strong>The Guardian Australia Weekend</strong> brings you The
        Guardian&rsquo;s perspective and analysis on the most important stories
        from throughout the week, to be enjoyed across the weekend
    </p>
    <p>
        The Guardian Australia Weekend is published weekly - each edition
        available to read by 6am (AEST), every Saturday
    </p>
    <p>The Guardian Editions app features;</p>
    <p>
        <strong>A new way to read</strong> - newspapers, reimagined for mobile
        and tablet
    </p>
    <p>
        <strong>Easy to navigate</strong> - read it all, or swipe to the
        sections you care about
    </p>
    <p>
        <strong>Read offline</strong> - download and read whenever it suits you
    </p>
    <p>
        <strong>Multiple devices</strong> - beautifully designed for your mobile
        or tablet on iOS and Android
    </p>
    <p>
        <strong>Ad-free</strong> - enjoy our journalism uninterrupted, without
        adverts
    </p>
    <h2>How do I purchase the Guardian Editions app?</h2>
    <p>
        The Guardian Editions app is available as part of a Digital
        subscription, or a print+digital subscription, details of which can be
        found on our website.
    </p>
    <p>
        The Guardian&rsquo;s complete digital subscription is built to fit with
        any routine. Two innovative apps, plus ad-free reading on
        theguardian.com, will give you an enhanced experience of our reporting
        across all your devices. You&rsquo;ll enjoy our coverage in a way that
        suits you - and you&rsquo;ll provide valuable support to The
        Guardian&rsquo;s independent, award-winning journalism.
    </p>
    <p>
        <strong>The Guardian Editions app</strong> - which includes the UK Daily
        edition, Australia Weekend and a special environment Edition.
    </p>
    <p>
        <strong>Premium access to the Live app</strong> - breaking news, sport
        and opinion, updated throughout the day
    </p>
    <p>
        <strong>Ad-free</strong> - no adverts and no interruptions across all
        your devices
    </p>
    <p>You can find out more about subscribing and pricing on our website.</p>
    <p>
        You can also access the Guardian Editions app if you have an existing
        iTunes subscription. Please note, the Guardian Editions app is no longer
        available to purchase as a stand alone product in iTunes.
    </p>
    <h2>How do I access the Guardian Editions app?</h2>
    <p>
        Once you have purchased a digital subscription, the Guardian Editions is
        available to download from either
        <a
            href="https://apps.apple.com/gb/app/the-guardian-daily-edition/id452707806"
            >here</a
        >
        for iOS devices (iOS 12 and above), or
        <a
            href="https://play.google.com/store/apps/details?id=com.guardian.editions"
            >here</a
        >
        for android devices.
    </p>
    <p>
        Once you have downloaded the Guardian Editions app, press the app icon
        on your device to open.
    </p>
    <p>
        Within the Guardian Editions app you will be asked if you are already a
        subscriber, by selecting sign-in you will be prompted to enter your
        Guardian account details.
    </p>
    <p>
        From here, enter the same Guardian account details associated with your
        Digital subscription.
    </p>
    <p>
        If you do not remember your Guardian account details you can also access
        the app using your Subscriber ID. Your Subscriber ID can be found on
        your subscription confirmation email. If you are a Paper + Digital
        subscriber, your subscriber ID can also be found on the vouchers you
        exchange for the newspaper. To enter, open the drop down icon on the top
        right and tap on the cog icon on the top left to access:
    </p>
    <p>
        From the settings menu tap &lsquo;I am already subscribed&rsquo;, then
        &lsquo;Activate with subscriber ID&rsquo;
    </p>
    <p>
        If you are an existing iTunes subscriber, the app will automatically
        detect your iTunes login details provided you are using the same device
        used to access your previous subscription to the Guardian Edition app.
    </p>
    <p>
        If you are using a new Apple device, tap on the yellow button top right
        corner, then tap the cog icon to open settings. From here, click 'I am
        already subscribed', then tap on your app store subscription where you
        will be prompted to enter your iTunes account sign-in details.
    </p>
    <p>
        If you choose to sign in with Apple please choose to share rather than
        hide your email address with us. This allows us to match you to your
        existing Guardian subscription.
    </p>
    <p>
        If you opted to hide your email, and would like to change that choice so
        that we can match your email to your Guardian subscription, please see
        <a href="https://support.apple.com/en-us/HT210426"
            >the information here</a
        >
        on how to manage your apps that use Sign in with Apple. Removing
        authorisation for the Guardian Editions app and signing in with Apple
        again will give you the opportunity again to share your email address
        with us.
    </p>
    <p>
        You can find out more about setting up a Guardian account on our
        website.
    </p>
    <h2>How do I access different Editions?</h2>
    <p>
        Tap on the Edition selector button on the top left hand corner of the
        home screen, this will open a new screen where you can select different
        Editions.
    </p>
    <h2>Can I access the Guardian Editions app on more than one device?</h2>
    <p>
        Yes, If you are a Digital subscriber, you can access the app on up to 10
        devices on either Apple or Android operating systems.
    </p>
    <p>
        If you are an existing iTunes subscriber, you can access on up to 10
        iPad and iPhone devices.
    </p>
    <h2>What time is the latest edition available each day?</h2>
    <p>The UK Daily edition is typically available from 6am GMT each day.</p>
    <p>
        The Australia Weekend edition is typically available from 6am AEST on
        Saturday.
    </p>
    <h2>Can I use the Guardian Editions app when I&rsquo;m abroad?</h2>
    <p>
        Yes, we advise checking with your operator prior to using the app abroad
        as most monthly plans charge extra for data roaming while overseas. As
        this can often be expensive, either sync using Wi-Fi and read the
        edition offline or contact your service provider for details of how to
        purchase cut-price roaming tariffs.
    </p>
    <h2>How do I access crosswords?</h2>
    <p>
        The UK Guardian Daily features crosswords everyday and can always be
        found at the bottom of the home page.
    </p>
    <p>
        The Australia Weekend features a crossword in every week&rsquo;s edition
        and can always be found at the bottom of the home page.
    </p>
    <h2>Can I access video in the Guardian Editions app?</h2>
    <p>
        Yes, the Edition app gives you access to videos featured in the last 30
        days of editions while your device is online. To listen to a video
        audio, your phone or tablet ring should be ON, not silent.
    </p>
    <h2>How do I change the font size?</h2>
    <p>
        Article text size can be adjusted within the accessibility settings on
        your device.
    </p>
    <h2>Is there a dark mode?</h2>
    <p>
        It's currently not available, but we might have it in the future if
        there's strong demand.
    </p>
    <h2>How do I share content?</h2>
    <p>
        Articles available for sharing have a share icon (screenshot) on the
        right hand side near the top of the article page.
    </p>
    <p>
        For technical reasons, currently, not all articles are available for
        sharing and therefore won&rsquo;t have a share icon. Articles are
        available for sharing if a web version of the article is published
        before the day&rsquo;s issue is published. There's also some print-only
        content only available on the Editions app and the printed newspaper,
        not the web.
    </p>
    <h2>Can I hide the weather ?</h2>
    <p>
        You can elect to show or hide the weather in the Settings page of the
        app.
    </p>
    <h2>Are there versions for regions outside of the UK and Australia?</h2>
    <p>
        More regionalised versions are something we intend to introduce. When a
        local version is available in your region, you will be notified in app
        or over email.
    </p>
    <h2>
        I used to read the Daily app, how is the new Editions app different?
    </h2>
    <p>
        You can still access the UK Daily edition within the Guardian Editions
        app. We have changed the name when we introduced the Australia Weekend
        edition in October 2020, to reflect the fact you can now access multiple
        regional editions as well as one-off special editions.
    </p>
    <h2>
        I have feedback on the Guardian Editions app, where should I send it?
    </h2>
    <p>
        If you have any feedback or suggestions for our development team, you
        can contact us through the app by tapping on the yellow button in the
        top right corner, then tap the cog icon to open settings and select
        Help. You can also email Editions.feedback@theguardian.com.
    </p>
    <h2>Where can I find out more information about my subscription?</h2>
    <p>
        You&rsquo;ll find more Digital subscription FAQs can be found on our
        website.
    </p>
`

const FAQScreen = () => <DefaultInfoTextWebview html={faqHtml} />

FAQScreen.navigationOptions = {
    title: 'FAQ',
}

export { FAQScreen }
