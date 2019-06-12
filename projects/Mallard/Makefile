debug-android:
	mkdir -p android/app/src/main/assets
	yarn bundle-android
	cd android && ./gradlew assembleDebug && cd ..
	cp android/app/build/outputs/apk/debug/app-debug.apk .

debug-ios:
	yarn bundle-ios
	xcodebuild archive -allowProvisioningUpdates -project ios/Mallard.xcodeproj -configuration Debug -scheme Mallard -derivedDataPath ./ -archivePath "./Mallard.xcarchive" > build.log
	xcodebuild -exportArchive -allowProvisioningUpdates -exportOptionsPlist ExportOptions.plist -archivePath "./Mallard.xcarchive" -exportPath ./ >> build.log

beta-ios:
	yarn bundle-ios
	fastlane ios beta

beta-android:
	yarn bundle-android
	fastlane android beta
