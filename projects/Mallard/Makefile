update-bundler:
	gem install --user-install bundler
	bundle update --bundler

debug-android:
	mkdir -p android/app/src/main/assets
	yarn bundle-android
	cd android && ./gradlew assembleDebug && cd ..
	cp android/app/build/outputs/apk/debug/app-debug.apk .

debug-ios:
	yarn bundle-ios
	xcodebuild archive -allowProvisioningUpdates -project ios/Mallard.xcodeproj -configuration Debug -scheme Mallard -derivedDataPath ./ -archivePath "./Mallard.xcarchive" > build.log
	xcodebuild -exportArchive -allowProvisioningUpdates -exportOptionsPlist ios/exports-plists/debug.plist -archivePath "./Mallard.xcarchive" -exportPath ./ >> build.log

beta-ios: update-bundler
	yarn bundle-ios
	fastlane ios beta

beta-android: update-bundler
	mkdir -p android/app/src/main/assets
	yarn bundle-android
	rm -rf android/app/src/main/res/drawable-*
	fastlane android beta
