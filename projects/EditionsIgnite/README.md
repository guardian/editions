# Editions

## Using

Run `yarn run-ios` or `yarn run-android` to start either target.

## Installing

Follow React native's <a href="https://facebook.github.io/react-native/">CLI Quickstart</a> to get set up.

You will need [Android Studio](https://developer.android.com/studio) and, if using a mac, [XCode](https://developer.apple.com/download/more/). If you are on a GNM machine chances are the App Store isn't working for you – Follow the link to get a direct download.
If you're starting from scratch, we recommend starting out with Android Studio because it takes less time to download.


### Troubleshooting

- Make sure your phone and computer are on the same WIFi network.
- Inside your Android App, you might need to do a one time setup to change the development port. Shake the device, go to `Dev Settings`, and set your debug server host to `localhost:9001`.


### Tips 'n' Tricks

#### Android over WiFi



1. Connect both devices to the same network.
2. Connect android device by USB.
3. Verify with `adb devices`
4. `adb tcpip 5555`
5. Find devices ip address. `adb shell ifconfig wlan0`
6. `adb connect ${IP}`
7. `adb reverse tcp:8097 tcp:8097`
8. `adb reverse tcp:8081 tcp:8081`

