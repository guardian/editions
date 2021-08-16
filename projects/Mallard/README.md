# Editions

## Installing

Follow the instructions in the [main README](https://github.com/guardian/editions/blob/master/README.md).

For iOS development you will need to install Xcode from the App Store and then open it once and select "Install" on the pop up asking whether to install other required Xcode dependencies - specifically the simulator. If this doesn't appear go to `Preferences > Components` and download the latest simulator iOS version. Additionally, you need to have the right version of CocoaPods installed. CocoaPods is a ruby thing, for a reliable install it's worth installing [Ruby Version Manager](https://rvm.io/rvm/install) first.

It's best to install the same version of cocoapods as is in the Podfile.lock - see [here](https://github.com/guardian/editions/blob/master/projects/Mallard/ios/Podfile.lock#L509)

```sh
gem install cocoapods -v 1.9.0 # this may require `sudo` if you're not using rvm or rbenv
```

The following guides allow you to run the app locally on device emulators, or on real devices connected to your dev machine via USB.

-   [Android](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies-1)
-   [iOS](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies)

**Note on installing Xcode:** If you are on a GNM machine chances are the App Store isn't working for you – [click here](https://developer.apple.com/download/more/) to get a direct download. If using version 10 of Xcode, you will need Xcode 12.

If you're starting from scratch, we recommend starting out with Android Studio because it takes less time to download. Once you've downloaded
android studio, open the project `/projects/Mallard/android` then open up the 'virtual device manager' and install at least one device.

You will also need `mobile` credentials form Janus in order to fetch the `.env` file for local development. This will run as part of either `run-ios` or `run-android` and in order to get the latest environment variables you will need to ensure you have mobile credentials when running at various points in the future.

## Usage

### Android

```bash
$ yarn start
```

in separate terminal

```bash
$ yarn run-android
```

### Android (over wifi)

Make sure your phone and computer are on the same WiFi network.

```bash
$ yarn start
```

in separate terminal

```bash
$ yarn run wifi-android
```

### Android PROD build locally

Make sure you have these two files in in android/app folder:
`editions-release.keystore`
`gradle.properties`

You can download them from S3 (mobile) in config folder

First run:

```bash
yarn local-bundle-android
```

And then run:

```bash
cd android && ./gradlew clean installRelease
```

### iOS

```bash
$ yarn start
```

in separate terminal

```bash
$ yarn run-ios
```

## Tips and tricks

### Adding images

If you wanna add static svgs, put them in the `assets/svgs` folder and run `yarn convert-svg`

### iPad testing

To test the iPad version, run `yarn run-ipad`. To test responsive layouts, you can enter multitasking inside the iPad simulator (swipe up from the bottom of the window) and drag another app from the dock to the side until it goes into split view.

### Upgrading React Native

rn update: run this to clear your cache
(https://medium.com/@abhisheknalwaya/how-to-clear-react-native-cache-c435c258834e)

```bash
watchman watch-del-all &&
rm -rf $TMPDIR/react-native-packager-cache-* &&
rm -rf $TMPDIR/metro-bundler-cache-* &&
rm -rf node_modules/ &&
yarn cache clean &&
yarn install &&
yarn start -- --reset-cache
```

### Update credits page content

We can use an auto credits generator tool to scan package.json file and generates a `credits` content. There are many tools out there. We can use `credits-generator` for this purpose. If we do use this tool then steps are:

1. run `npx @opengovsg/credits-generator` - this will produce a CREDITS.md file
2. Copy the content of `CREDITS.md` file and convert it into html (https://markdowntohtml.com/ can be use for this purpose)
3. Converted html needs to be `string escapped` so we use it in a json file (https://www.freeformatter.com/json-escape.html can be use for this purpose)
4. Copy the string escapped html content and paste inside `credits.json` file under `bodyHtml`


### Stages and Environment

Editions app has multiple stages and environments and they explained in this [document](https://docs.google.com/document/d/1fopf0JamGZb1rswj2rFRgpYbtBj5OW9Kkieb1LJEnlw/edit?usp=sharing)