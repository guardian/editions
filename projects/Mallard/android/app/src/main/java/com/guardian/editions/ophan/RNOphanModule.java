package com.guardian.editions.ophan;

import android.os.Build;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.firebase.iid.FirebaseInstanceId;
import com.guardian.editions.BuildConfig;

import java.io.File;
import java.util.UUID;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import ophan.OphanApi;
class RNOphanModule extends ReactContextBaseJavaModule {

    @Nonnull
    private final File recordStoreDir;

    @Nonnull
    private OphanApi ophanApi;

    public RNOphanModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        recordStoreDir = new File(reactContext.getCacheDir(), "ophan");
        ophanApi = newOphanApi(null);
    }

    private OphanApi newOphanApi(@Nullable String userId) {
        return new OphanApi(
                "Android Editions",
                BuildConfig.VERSION_NAME,
                Build.VERSION.RELEASE,
                Build.MODEL,
                Build.MANUFACTURER,
                getDeviceId(),
                userId,
                new LogcatLogger(),
                recordStoreDir.getAbsolutePath()
        );
    }

    @Nonnull
    private static String getDeviceId() {
        return FirebaseInstanceId.getInstance().getId();
    }

    @Nonnull
    @Override
    public String getName() {
        return "Ophan";
    }

    @ReactMethod
    public void setUserId(@Nullable String userId, Promise promise) {
        try {
            ophanApi = newOphanApi(userId);
            promise.resolve(userId);
        } catch (Throwable e) {
            promise.reject(e);
        }
    }

    public void sendAppScreenEvent(String screenName, String value, Promise promise) {
        try {
            ophanApi.sendAppScreenEvent(screenName, value, UUID.randomUUID().toString());
            promise.resolve(true);
        } catch (Throwable e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sendAppComponentEvent(String component, String action, String value, String id, Promise promise) {
        try {
            ophanApi.sendAppComponentEvent(component, action, value, id, UUID.randomUUID().toString());
            promise.resolve(true);
        } catch (Throwable e) {
            promise.reject(e);
        }
    }
}