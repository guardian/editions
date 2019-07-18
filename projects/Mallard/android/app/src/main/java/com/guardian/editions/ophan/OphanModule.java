package com.guardian.editions.ophan;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

import ophan.OphanKt;

class OphanModule extends ReactContextBaseJavaModule {

    public OphanModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "Greeting";
    }

    @ReactMethod
    public void getGreeting(Callback callback) {
        String kotlinGreeting = OphanKt.hello();
        callback.invoke(kotlinGreeting);
    }
}