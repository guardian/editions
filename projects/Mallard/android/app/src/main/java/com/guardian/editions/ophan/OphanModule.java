package com.guardian.editions.ophan;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

import ophan.OphanApi;
import ophan.OphanKt;

class OphanModule extends ReactContextBaseJavaModule {

    private OphanApi ophanApi = new OphanApi(
            "0.0.1",
            "Android",
            "Unknown",
            "Unknown",
            "testDeviceId",
            "testUserId",
            new LogcatLogger()
    );

    public OphanModule(@Nonnull ReactApplicationContext reactContext) {
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
    public void sendTestAppScreenEvent(String screenName) {
        try {
            ophanApi.sendTestAppScreenEvent(screenName);
            //promise.resolve(null);
        } catch (Throwable e) {
            //promise.reject(e);
        }
    }
}