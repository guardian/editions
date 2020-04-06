# Releases on iOS and Android

## Status: Accepted (but can still be improved)

## Context

We need a consistent and battle tested process for releasing the app on both Android and iOS.

## Decision

### iOS

#### Internal Beta

Our internal Beta is managed through testflight on the Guardian developer account. The group which this beta is sent to is labelled `GNM`. This includes the team and internal stakeholders within the organisation. We build this automatically through Fastlane and TeamCity once a day. Occasionally we will set off builds to test things on a number of devices.

The TeamCity process is labelled `ios-beta-deploy`

#### External Beta

Before every release, we aim to do at least one external beta to gather feedback. We have a number groups within testflight that are prefixed with the name `External Testers...`. These different groups represent the different authentication methods we support. When we decide a build is good enough from an internal test, we add the build to the groups.

#### Release

After a successful beta period, we release the same build (identified by its build number) through the app store submission process.

#### Post Release

We update the version number in XCode and raise that as a PR. The version number will depend on the goals for the next release. We follow a major and minor number approach with no patch i.e. 5.6

### Android

#### Internal Beta

In a similar vein as above, the Android internal beta is managed through Google Play. The APK for this is created using Fastlane through TeamCity. The name of this process is `android-beta-deploy`. The list for this is managed within the Google Play console. This process runs once per day. Users will need to update their app through their Google Play store.

#### External Beta

We take a slightly different approach to iOS. Due to not being able to determine within the app whether or not the app is in Beta or release, we have to create a release branch. This ensures that what we test in Beta is at the same point in time to what we release. We use the naming convention of `release/[version]` when creating this branch and is branched from Master.

The release number as it stands is `1.0.[next number]`. There is a ticket to improve this in the backlog.

We build the APK using `android-beta-deploy`. This will first go into internal beta where the team will check it. It is then promoted within the Google Play console to our external beta testers.

#### Release

After a successful external beta test, we **DO NOT** promote the external beta. This is because we have code in the app that attempts to determine whether or not the user is in beta. This does not work on Android as there isn't a distinction.

As a result, we then use the TeamCity process `android-release-deploy` to then build the APK from the release branch defined in the external beta. Be warned, this process will automatically release the new version of the app. You will then need to go into the Google Play console to update the release notes.

## Alternatives

A more automated process that involves less possibility for human error.

## Consequences

-   Accidental release of Android app is very easy.
-   Releasing Android without having release notes is easy.
-   Lack of control over Android version numbering
