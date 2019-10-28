import React from 'react'
import { DefaultInfoTextWebview } from './default-info-text-webview'
import { LoginHeader } from 'src/components/login/login-layout'
import { PRIVACY_POLICY_HEADER_TITLE } from 'src/helpers/words'
import { NavigationInjectedProps } from 'react-navigation'
import { html } from 'src/helpers/webview'

const privacyPolicyHtml = html`
    <h2><strong>About this privacy policy</strong></h2>
    <p>
        This is a privacy policy for the Guardian Daily. The privacy policy
        explains how we (Guardian News &amp; Media Limited) collect, use, share
        and transfer your personal data when you use the services provided by
        the Daily. This is separate to how we collect and use your personal data
        on theguardian.com, which is explained in this
        <a href="https://www.theguardian.com/help/privacy-policy"
            >privacy policy</a
        >. Sometimes this app may contain links to third party sites. These
        sites have their own privacy policies. If you follow a link to a third
        party, you should read the privacy policy shown on their site.
    </p>
    <p>
        This privacy policy covers our use of your personal data. Personal data
        is any information about you by which you can be identified. This can
        include information such as:
    </p>
    <ul>
        <li><p>your name, email address;</p></li>
        <li>
            <p>
                information about your device (such as the IP address, which is
                a numerical code to identify your device that can provide
                information about the country, region or city where you are
                based); and
            </p>
        </li>
        <li>
            <p>
                information relating to your personal circumstances and how you
                use this app.
            </p>
        </li>
    </ul>
    <h2><strong>Who we are and how to contact us</strong></h2>
    <p>
        The data controller for the Daily is Guardian News &amp; Media Limited,
        Kings Place, 90 York Way, London N1 9GU. This means that we are
        responsible for deciding how and why we hold and use your personal data.
        If you want to contact us, you can find our contact details in the “How
        to contact us” section below.
    </p>
    <p><strong>What personal data we collect and how we use it</strong></p>
    <p>
        We collect personal data when you sign up for this app and its services
        through the Guardian website, and when you use this app. This
        information is used to provide our journalism and other services, and
        analyse how visitors use our app.
    </p>
    <p>
        <em><strong>Registering an account with us</strong></em>
    </p>
    <p>
        When you register for a Guardian account on theguardian.com we collect:
    </p>
    <ul>
        <li><p>your name;</p></li>
        <li><p>your email address;</p></li>
        <li>
            <p>
                some limited data from your social media profile (further
                information on this is below) if you have signed in to
                theguardian.com using your social media details; and
            </p>
        </li>
        <li><p>your photograph, if you add one to your profile page.</p></li>
    </ul>
    <p>
        For more information about how we use your data on theguardian.com,
        please see this
        <a href="https://www.theguardian.com/help/privacy-policy"
            >privacy policy</a
        >.
    </p>
    <p>
        When you use this app, we may also use technology that is similar to
        cookies to collect additional data, including:
    </p>
    <ul>
        <li>
            <p>
                your IP address – a numerical code to identify your device and
                which can provide information about the country, region or city
                where you are based;
            </p>
        </li>
        <li>
            <p>
                your browsing history of the content and screens you have viewed
                on this app; and
            </p>
        </li>
        <li>
            <p>
                details of your devices, for example, the unique device ID,
                unique advertising ID and browsers used to access our content.
            </p>
        </li>
    </ul>
    <p>
        <em><strong>Using our app</strong></em>
    </p>
    <p>
        The Daily uses information on the content you have viewed. A list of the
        articles that you have recently viewed is cached in the local storage on
        your mobile device. You can delete this reading history in the settings
        of the app. Information on what you have viewed in the app and
        information on bugs and crashes is also sent to us. You can choose to
        receive notifications on your mobile device via the app. You can manage
        these notifications in the settings of the app.
    </p>
    <h2><strong>How we collect personal data</strong></h2>
    <p>We collect personal data via :</p>
    <ul>
        <li>
            <p>
                technology similar to cookies when you use mobile devices to
                access the content in the app;
            </p>
        </li>
        <li><p>email or when you contact us via our app</p></li>
    </ul>
    <p><strong>Why we use your personal data</strong></p>
    <p>
        We use personal data collected through our app for a number of purposes,
        including the following:
    </p>
    <ul>
        <li>
            <p>
                To provide the services you sign up for, including accessing
                your Digital subscription. We also use the personal data for
                related internal administrative purposes – such as our
                accounting and records – and to make you aware of any changes to
                our services.
            </p>
        </li>
        <li>
            <p>
                To send marketing communications when we have your permission,
                or when permitted by law.
            </p>
        </li>
        <li>
            <p>
                To personalise our services (for example, so you can sign in),
                remembering your settings, recognising you when you sign in on
                different devices and tailoring our marketing communications
                based on what you read on our sites and apps.
            </p>
        </li>
        <li>
            <p>
                To carry out marketing analysis, for example, we look at what
                you have viewed on our apps. You can opt out from having your
                personal data used for marketing analysis by going into your
                theguardian.com account to the tab “Emails and marketing”.
            </p>
        </li>
        <li>
            <p>
                For statistical purposes such as analysing the performance of
                our apps and to understand how visitors use it.
            </p>
        </li>
        <li><p>To respond to your queries and to resolve complaints.</p></li>
        <li>
            <p>
                For security and fraud prevention, and to ensure that our app is
                safe and secure and used in line with our
                <a
                    href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions"
                    >terms of use</a
                >.
            </p>
        </li>
        <li><p>To comply with applicable laws and regulations.</p></li>
        <li>
            <p>
                To enable us to detect and fix any bugs or defects within the
                app.
            </p>
        </li>
    </ul>
    <p>
        <em><strong>Legal grounds for using your personal data</strong></em>
    </p>
    <p>
        We will only use your personal data where we have a legal ground to do
        so. We determine the legal grounds based on the purposes for which we
        have collected and used your personal data. In every case, the legal
        ground will be one of the following:
    </p>
    <ul>
        <li>
            <p>
                Consent: For example, where you have provided your consent to
                receive marketing emails from us on theguardian.com. You can
                withdraw your consent at any time. In the case of marketing
                emails you can withdraw your consent by clicking on the
                “unsubscribe” link at the bottom of the email or through your
                email preferences in the “emails and marketing” tab, when signed
                into your Guardian account.
            </p>
        </li>
    </ul>
    <ul>
        <li>
            <p>
                Our legitimate interests: Where it is necessary for us to
                understand our readers, promote our services and operate our
                sites and apps efficiently for the creation, publication and
                distribution of news, media and related journalistic content
                both online and in print form, globally. For example, we will
                rely on our legitimate interest when we analyse what content has
                been viewed on our sites and apps, so that we can understand how
                they are used. It is also in our legitimate interest to carry
                out marketing analysis to determine what products and services
                may be relevant to the interests of our readers. You can opt out
                from having your personal data used for marketing analysis in
                your account in the “emails and marketing” tab on the Guardian
                website.
            </p>
        </li>
    </ul>
    <ul>
        <li>
            <p>
                Performance of a contract with you (or in order to take steps
                prior to entering into a contract with you): For example, where
                you have purchased a subscription from us and we need to use
                your contact details and payment information in order to process
                your order and deliver your subscription.
            </p>
        </li>
    </ul>
    <ul>
        <li>
            <p>
                Compliance with law: In some cases, we may have a legal
                obligation to use or keep your personal data.
            </p>
        </li>
    </ul>
    <h2>
        <strong
            >Personal data that we receive about you from other
            organisations</strong
        >
    </h2>
    <p><em>Adding to or combining the personal data you provide to us</em></p>
    <p>
        When you subscribe to our services, we may add to the personal data you
        give us by combining it with information shared with us by other trusted
        organisations. This includes, for example, information about the region
        that you are located in, so that we can show you the prices for
        subscriptions or other products in your local currency. We may also add
        information to improve the accuracy of your delivery address when we
        send out mail. We may also obtain information from partners whose offers
        we include in some of our marketing communications and we use this
        information to ensure that we do not send you irrelevant marketing.
    </p>
    <p>
        We also use information on the content you have viewed on our sites and
        apps and your interaction with the content to add you to groups with
        similar interests and preferences, so that we can make our online
        advertising more relevant. Sometimes we use data about your interests or
        demographics that third parties have collected from you online to add to
        these groups. Please refer to our cookies policy for more information on
        how we use
        <a href="https://www.theguardian.com/info/cookies">cookies</a>.
    </p>
    <h2><strong>Using children’s personal data</strong></h2>
    <p>
        We do not aim any of our products or services directly at children under
        the age of 13 and we do not knowingly collect personal data about
        children under 13. Some of our services may have a higher age
        restriction and this will be shown at the point of registration.
    </p>
    <h2><strong>Security of your personal data</strong></h2>
    <p>
        We have implemented appropriate technical and organisational controls to
        protect your personal data against unauthorised processing and against
        accidental loss, damage or destruction. You are responsible for choosing
        a secure password when we ask you to set up a password to access parts
        of this app. You should keep this password confidential and you should
        choose a password that you do not use on any other site. You should not
        share your password with anyone else, including anyone who works for us.
        Unfortunately, sending information via the internet is not completely
        secure. Although we will do our best to protect your personal data once
        with us, we cannot guarantee the security of any personal data sent to
        our site while still in transit and so you provide it at your own risk.
    </p>
    <p><strong>Who we share your personal data with</strong></p>
    <p>
        We do not share your personal data with other people or organisations
        that are not directly linked to Guardian News &amp; Media Limited except
        under the following circumstances:
    </p>
    <ul>
        <li>
            <p>
                We may share your data with other organisations that provide
                services on our behalf such as fraud prevention services,
                services that assist with tracking errors and defects in the
                app, as well as services that deal with online payments and
                other forms of payment processing, ie credit card transactions.
            </p>
        </li>
        <li>
            <p>
                We may reveal your personal data to any law enforcement agency,
                court, regulator, government authority or other organisation if
                we are required to do so to meet a legal or regulatory
                obligation, or otherwise to protect our rights or the rights of
                anyone else.
            </p>
        </li>
        <li>
            <p>
                We may reveal your personal data to any other organisation that
                buys, or to which we transfer all, or substantially all, of our
                assets and business. If this sale or transfer takes place, we
                will use reasonable efforts to try to make sure that the
                organisation we transfer your personal data to uses it in line
                with our privacy policy.
            </p>
        </li>
    </ul>
    <p>
        Any organisations which access your data in the course of providing
        services on our behalf will be governed by strict contractual
        restrictions to make sure that they protect your data and keep to all
        data privacy laws that apply. We may also independently audit these
        service providers to make sure that they meet our standards.
    </p>
    <p>
        We will not share your personal data with anyone else for their own
        marketing purposes unless we have your permission to do this.
    </p>
    <h2><strong>International data transfers</strong></h2>
    <p>
        Data we collect may be transferred to, stored and processed in any
        country or territory where one or more of our Guardian group companies
        or service providers are based or have facilities. While other countries
        or territories may not have the same standards of data protection as
        those in your home country, we will continue to protect personal data
        that we transfer in line with this privacy policy.
    </p>
    <p>
        Whenever we transfer your personal data out of the UK or the European
        Economic Area (EEA), we ensure similar protection and put in place at
        least one of these safeguards:
    </p>
    <ul>
        <li>
            <p>
                We will only transfer your personal data to countries that have
                been found to provide an adequate level of protection for
                personal data.
            </p>
        </li>
        <li>
            <p>
                We may also use specific approved contracts with our service
                providers that are based in countries outside the UK or the EEA.
                These contracts give your personal data the same protection it
                has in the UK .
            </p>
        </li>
        <li>
            <p>
                Where we use service providers in the United States, we may
                transfer personal data to them if they are part of the Privacy
                Shield scheme, which requires them to provide a similar level of
                protection of your personal data to what is required in the UK
                and the EEA.
            </p>
        </li>
    </ul>
    <p>
        If you are located in the UK or EEA, you may contact us for a copy of
        the safeguards which we have put in place for the transfer of your
        personal data outside the UK or EEA.
    </p>
    <h2><strong>How long we keep your personal data</strong></h2>
    <p>
        We keep your personal data for only as long as we need to. How long we
        need your personal data depends on what we are using it for, as set out
        in this privacy policy. For example, we may need to use it to answer
        your queries about a product or service and as a result may keep
        personal data while you are still using our product or services. We may
        also need to keep your personal data for accounting purposes, for
        example, where you have bought a subscription. If we no longer need your
        data, we will delete it or make it anonymous by removing all details
        that identify you. If we have asked for your permission to process your
        personal data and we have no other lawful grounds to continue with that
        processing, and you withdraw your permission, we will delete your
        personal data. However, when you unsubscribe from marketing
        communications, we will keep your email address to ensure that we do not
        send you any marketing in future.
    </p>
    <h2><strong>How we may contact you</strong></h2>
    <p><em>Service communications</em></p>
    <p>
        From time to time we may send you service emails, for example, telling
        you your subscription is coming to an end or thanking you when you
        contribute or place an order with us.
    </p>
    <p><em>Marketing communications and editorial newsletters</em></p>
    <p>
        While there is no online advertising on this app, we may send you
        materials we think may interest you, such as new Guardian offers and
        updates, if we have your permission. Depending on your marketing
        preferences, this may be by email, phone, SMS or post. You can manage
        your preferences through the tab “Emails and marketing” when you are
        signed in to your Guardian account through our website.
    </p>
    <p><em>Responding to your queries or complaints</em></p>
    <p>
        If you have raised a query or a complaint with us, we may contact you to
        answer your query or to resolve your complaint.
    </p>
    <h2>
        <strong
            >Your rights with regard to the personal data that we hold about
            you</strong
        >
    </h2>
    <p>
        You can contact us with regard to the following rights in relation to
        your personal data:
    </p>
    <ul>
        <li>
            <p>
                If you would like to have a copy of the personal data we hold on
                you or if you think that we hold incorrect personal data about
                you, please write to the Data Protection Officer at Guardian
                News &amp; Media Limited, Kings Place, 90 York Way, London N1
                9GU or email dataprotection@theguardian.com. We will deal with
                requests for copies of your personal data or for correction of
                your personal data within one month. If your request is
                complicated or if you have made a large number of requests, it
                may take us longer. We will let you know if we need longer than
                one month to respond. You will not have to pay a fee to obtain a
                copy of your personal data (or to exercise any of the other
                rights). However, we may charge a reasonable fee if your request
                is clearly unfounded, repetitive or excessive.
            </p>
        </li>
        <li>
            <p>
                Where you have provided us with consent to use your personal
                data, you can withdraw this at any time.
            </p>
        </li>
        <li>
            <p>
                Where applicable, you may also have a right to receive a
                machine-readable copy of your personal data.
            </p>
        </li>
        <li>
            <p>
                You also have the right to ask us to delete your personal data
                or restrict how it is used. There may be exceptions to the right
                to erasure for specific legal reasons which, if applicable, we
                will set out for you in response to your request. Where
                applicable, you have the right to object to processing of your
                personal data for certain purposes.
            </p>
        </li>
        <li>
            <p>
                If you do not want us to use your personal data for marketing
                analysis, you can change your settings in the “Emails and
                marketing” tab of your Guardian account.
            </p>
        </li>
    </ul>
    <p>
        If you want to make any of these requests, please contact
        dataprotection@theguardian.com.
    </p>
    <p>
        We may need to request specific information from you to help us confirm
        your identity.
    </p>
    <h2><strong>Your California privacy rights</strong></h2>
    <p>
        Under California Civil Code Section 1798.83, if you live in California
        and your business relationship with us is mainly for personal, family or
        household purposes, you may ask us about the information we release to
        other organisations for their marketing purposes. To make such a
        request, please send an email to dataprotection@theguardian.com with
        “Request for California privacy information”in the subject line. You may
        make this type of request once every calendar year. We will email you a
        list of categories of personal data we revealed to other organisations
        for their marketing purposes in the last calendar year, along with their
        names and addresses. Not all personal data shared in this way is covered
        by Section 1798.83 of the California Civil Code.
    </p>
    <h2>
        <strong
            >Contact us for information about how we use your personal
            data</strong
        >
    </h2>
    <p>
        If you have any questions about how we use your personal data or if you
        have a concern about how your personal data is used, please contact the
        Data Protection Officer at Guardian News &amp; Media Limited, Kings
        Place, 90 York Way, London N1 9GU. Or, email
        dataprotection@theguardian.com.
    </p>
    <p>
        Complaints will be dealt with by the Data Protection Officer, and will
        be responded to within 30 days.
    </p>
    <p>
        If you are not satisfied with the way your concern has been handled, you
        can refer your complaint to the Information Commissioner’s Office.
    </p>
    <p>
        If you have a question about anything else, please see our Contact us
        information under Settings -&gt; Help in this app.
    </p>
    <p><strong>Changes to the Privacy Policy</strong></p>
    <p>
        If we decide to change our privacy policy we will post the changes here.
        If the changes are significant, we may also choose to email all our
        registered users with the new details. If required by law, we will get
        your permission or give you the opportunity to opt out of any new uses
        of your data.
    </p>
`

const PrivacyPolicyScreen = () => (
    <DefaultInfoTextWebview html={privacyPolicyHtml} />
)

PrivacyPolicyScreen.navigationOptions = {
    title: PRIVACY_POLICY_HEADER_TITLE,
}

const PrivacyPolicyScreenForOnboarding = ({
    navigation,
}: NavigationInjectedProps) => (
    <>
        <LoginHeader onDismiss={() => navigation.goBack()}>
            {PRIVACY_POLICY_HEADER_TITLE}
        </LoginHeader>
        <DefaultInfoTextWebview html={privacyPolicyHtml} />
    </>
)

export { PrivacyPolicyScreen, PrivacyPolicyScreenForOnboarding }
