package com.guardian.editions.ophan;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import javax.annotation.Nonnull;
import java.util.UUID;

import ophan.OphanApi;
import ophan.OphanKt;
import com.gu.ophan.InMemoryRecordStore;

class RNOphanModule extends ReactContextBaseJavaModule {

    private OphanApi ophanApi = new OphanApi("0.0.1", "Android", "Unknown", "Unknown", "testDeviceId", "testUserId",
            new LogcatLogger(), new InMemoryRecordStore());

    public RNOphanModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "Ophan";
    }

    @ReactMethod
    public void getGreeting(Callback callback) {
        String kotlinGreeting = OphanKt.hello();
        callback.invoke(kotlinGreeting);
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