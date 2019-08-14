# Editions

## Installing

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

Start by installing our Node.js dependencies:

```bash
$ yarn
```

The following guides allow you to run the app locally on device emulators, or on real devices connected to your dev machine via USB.

-   [Android](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies-1)
-   [iOS](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies)

**Note on installing Xcode:** If you are on a GNM machine chances are the App Store isn't working for you – [click here](https://developer.apple.com/download/more/) to get a direct download.

If you're starting from scratch, we recommend starting out with Android Studio because it takes less time to download.

## Using

### Android

```bash
$ yarn run-android
```

### Android (over wifi)

Make sure your phone and computer are on the same WiFi network.

```bash
$ yarn run wifi-android
```

### iOS

```bash
$ yarn run-ios
```

## Tips and tricks

### Adding images

If you wanna add static svgs, put them in the `assets/svgs` folder and run `yarn convert-svg`

### iPad testing

To test the iPad version, run `yarn run-ipad`. To test responsive layouts, you can enter multitasking inside the iPad simulator (swipe up from the bottom of the window) and drag another app from the dock to the side until it goes into split view.
