# Editions

## Installing

Follow the instructions in the [main README](https://github.com/guardian/editions/blob/master/README.md).

For iOS development you will need to install Xcode from the App Store and then open it once and select "Install" on the pop up asking whether to install other required Xcode dependencies - specifically the simulator. If this doesn't appear go to `Preferences > Components` and download the latest simulator iOS version. Additionally, you need to have the right version of CocoaPods installed. CocoaPods is a ruby thing, for a reliable install it's worth installing [Ruby Version Manager](https://rvm.io/rvm/install) first.

It's best to install the same version of cocoapods as is in the Podfile.lock - see [here](https://github.com/guardian/editions/blob/master/projects/Mallard/ios/Podfile.lock#L509)

```sh
gem install cocoapods -v 1.7.5 # this may require `sudo` if you're not using rvm or rbenv
```

The following guides allow you to run the app locally on device emulators, or on real devices connected to your dev machine via USB.

-   [Android](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies-1)
-   [iOS](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies)

**Note on installing Xcode:** If you are on a GNM machine chances are the App Store isn't working for you – [click here](https://developer.apple.com/download/more/) to get a direct download. If using version 10 of Xcode, you will need at least version 10.3.

If you're starting from scratch, we recommend starting out with Android Studio because it takes less time to download. Once you've downloaded
android studio, open the project `/projects/Mallard/android` then open up the 'virtual device manager' and install at least one device.

You will also need `frontend` credentials form Janus in order to fetch the `.env` file for local development. This will run as part of either `run-ios` or `run-android` and in order to get the latest environment variables you will need to ensure you have frontend credentials when running at various points in the future.

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

### Storybook

Within the dev menu, there is a link to Storybook. [Storybook](https://storybook.js.org/) allows us to view components in isolation and helps to define a component library whilst looking at all potential edge cases. A useful tool for both FE developers and the UX/UI team. Storybook will automatically open in a browser when running `run-ios`, `run-android` or `run-ipad`. This browser window allows the user to the control what is happening in the Storybook window of the app.

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
