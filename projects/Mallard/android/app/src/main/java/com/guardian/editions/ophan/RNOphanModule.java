package com.guardian.editions.ophan;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

class RNOphanModule extends ReactContextBaseJavaModule {

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
        callback.invoke("Hello from Android's Greeting Module!");
    }
}