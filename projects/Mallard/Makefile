debug:
	mkdir -p android/app/src/main/assets
	yarn build-android-debug
	cd android && ./gradlew assembleDebug && cd ..
	cp android/app/build/outputs/apk/debug/app-debug.apk .
