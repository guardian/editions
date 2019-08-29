package com.guardian.editions.ophan;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gu.ophan.FileRecordStore;

import java.io.File;
import java.util.UUID;

import javax.annotation.Nonnull;

import ophan.OphanApi;

class RNOphanModule extends ReactContextBaseJavaModule {

    private final OphanApi ophanApi;

    public RNOphanModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        final File recordStoreDir = new File(reactContext.getCacheDir(), "ophan");
        ophanApi = new OphanApi(
                "0.0.1",
                "Android",
                "Unknown",
                "Unknown",
                "testDeviceId",
                "testUserId",
                new LogcatLogger(),
                new FileRecordStore(recordStoreDir.getAbsolutePath())
        );
    }

    @Nonnull
    @Override
    public String getName() {
        return "Ophan";
    }

    @ReactMethod
    public void sendTestAppScreenEvent(String screenName, Promise promise) {
        try {
            ophanApi.sendTestAppScreenEvent(screenName, UUID.randomUUID().toString());
            promise.resolve(screenName);
        } catch (Throwable e) {
            promise.reject(e);
        }
    }
}