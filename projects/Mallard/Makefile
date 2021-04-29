export DEVELOPER_DIR=/Applications/Xcode_12.4.app/Contents/Developer/
export JAVA_OPTS = -Xmx4096m -Dsun.jnu.encoding=UTF-8

debug-android:
	mkdir -p android/app/src/main/assets
	yarn jetify
	yarn bundle-android
	cd android && ./gradlew assembleDebug && cd ..
	cp android/app/build/outputs/apk/debug/app-debug.apk .

debug-ios:
	yarn bundle-ios
	xcodebuild archive -allowProvisioningUpdates -workspace ios/Mallard.xcworkspace -configuration Debug -scheme Mallard -derivedDataPath ./ -archivePath "./Mallard.xcarchive" > build.log
	xcodebuild -exportArchive -allowProvisioningUpdates -exportOptionsPlist ios/exports-plists/debug.plist -archivePath "./Mallard.xcarchive" -exportPath ./ >> build.log

beta-ios:
	yarn bundle-ios
	fastlane ios beta

beta-android:
	mkdir -p android/app/src/main/assets
	yarn jetify
	yarn bundle-android
	cd android && ./gradlew clean && cd ..
	fastlane android beta

release-android:
	mkdir -p android/app/src/main/assets
	yarn jetify
	yarn bundle-android
	cd android && ./gradlew clean && cd ..
	fastlane android release_to_production

PHONY: beta-android beta-ios debug-android debug-ios
