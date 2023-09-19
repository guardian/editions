# Releases on iOS and Android

## Status: Accepted (but can still be improved)

## Context

We need a consistent and battle tested process for releasing the app on both Android and iOS.

## Decision

### iOS

#### Internal Beta

Our internal Beta is managed through testflight on the Guardian developer account. The group which this beta is sent to is labelled `GNM`. This includes the team and internal stakeholders within the organisation. We build this automatically through Fastlane and Github Actions once a day. Occasionally we will set off builds to test things on a number of devices.

In github actions we have a [scheduled build](https://github.com/guardian/editions/actions?query=workflow%3Ascheduled-ios-beta) and an [ad-hoc one](https://github.com/guardian/editions/actions?query=workflow%3A%22Upload+ios-beta%22) triggered by a [script](https://github.com/guardian/editions/blob/main/script/upload-ios-build.sh)

All builds generate a ['release' in github](https://github.com/guardian/editions/releases) to help us keep track of build numbers against certain commits. This is handled by the [make-release script](https://github.com/guardian/editions/blob/main/script/make-release.js).

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

We take a slightly different approach to iOS. Due to not being able to determine within the app whether or not the app is in Beta or release, we have a different build configuration for releasing to production - which hides the 'report bug' button.

We build the APK using `android-beta-deploy`. This will release a build to google play to the 'internal beta' group for internal testing by the team. It is then manually promoted within the Google Play console to our external beta testers.

As with iOS, releases to the play store can be tracked in [github releases](https://github.com/guardian/editions/releases) - each time the teamcity build is run a new github release is created including the play store version code of that release.

#### Release

After a successful external beta test, we **DO NOT** promote the external beta. This is because we have code in the app that attempts to determine whether or not the user is in beta. This does not work on Android as there isn't a distinction.

As a result, we then use the TeamCity process `android-release-deploy` to then build the APK. As you will only want to release a version that has been beta tested, you can use the [releases](https://github.com/guardian/editions/releases) list to find a release for the build you want to release, and copy the tag for that build. You can then search for this tag in the branch list within teamcity (the `android-release-deploy` config treats github tags as if they were branchs) and run a build on that tag.

Be warned, this process will automatically release the new version of the app. You will then need to go into the Google Play console to update the release notes.

## Alternatives

A more automated process that involves less possibility for human error.

## Consequences

-   Accidental release of Android app is very easy.
-   Releasing Android without having release notes is easy.
-   Lack of control over Android version numbering
