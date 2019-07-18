package com.guardian.editions.greeting;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

import greeting.GreetingKt;

class GreetingModule extends ReactContextBaseJavaModule {

    public GreetingModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "Greeting";
    }

    @ReactMethod
    public void getGreeting(Callback callback) {
        String kotlinGreeting = GreetingKt.hello();
        callback.invoke(kotlinGreeting);
    }
}