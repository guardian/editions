debug-android:
	mkdir -p android/app/src/main/assets
	yarn build-android-debug
	cd android && ./gradlew assembleDebug && cd ..
	cp android/app/build/outputs/apk/debug/app-debug.apk .

debug-ios:
	yarn build-ios-debug
    xcodebuild archive -allowProvisioningUpdates -configuration Debug -scheme Mallard -derivedDataPath ./ -archivePath "./Mallard.xcarchive" > build.log
