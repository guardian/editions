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

The project uses `nvm` so this will need to be installed before if it's not already:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

Start by installing our Node.js dependencies:

```bash
$ nvm use
$ yarn
```

For iOS development you will need to install Xcode from the App Store and then open it once and select "Install" on the pop up asking whether to install other required Xcode dependencies - specifically the simulator. If this doesn't appear go to `Preferences > Components` and download the latest simulator iOS version. Additionally, you need have CocoaPods installed:

```
$ gem install cocoapods # this may require `sudo` if you're not using rvm or rbenv
```

The following guides allow you to run the app locally on device emulators, or on real devices connected to your dev machine via USB.

-   [Android](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies-1)
-   [iOS](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies)

**Note on installing Xcode:** If you are on a GNM machine chances are the App Store isn't working for you – [click here](https://developer.apple.com/download/more/) to get a direct download.

If you're starting from scratch, we recommend starting out with Android Studio because it takes less time to download.

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
