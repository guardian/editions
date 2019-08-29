package com.guardian.editions.ophan;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import javax.annotation.Nonnull;

import ophan.OphanApi;
import ophan.OphanKt;

class RNOphanModule extends ReactContextBaseJavaModule {

    private OphanApi ophanApi = new OphanApi("0.0.1", "Android", "Unknown", "Unknown", "testDeviceId", "testUserId",
            new LogcatLogger(), "ophan");

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
    public void sendTestAppScreenEvent(String screenName, String eventId, Promise promise) {
        try {
            ophanApi.sendTestAppScreenEvent(screenName, "JAMES");
            promise.resolve(screenName);
        } catch (Throwable e) {
            promise.reject(e);
        }
    }
}