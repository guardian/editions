package com.guardian.editions.externallink;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.Map;
import java.util.HashMap;

public class ExternalLink extends ReactContextBaseJavaModule {
    public ExternalLink(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNExternalLink";
    }

    @ReactMethod
    public void canOpen (Promise promise) {
        try {
            promise.resolve(false);
        } catch (Throwable e) {
            promise.reject(e);
        }
       
    }

    @ReactMethod
    public void open(Promise promise) {
        try {
            promise.resolve("This feature is not enabled for Android");
        } catch (Throwable e) {
            promise.reject(e);
        }
    }
}
