package com.guardian.editions;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

public class ReleaseStream extends ReactContextBaseJavaModule {
    public ReleaseStream(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNReleaseStream";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("getReleaseStream", "UNKNOWN");
        return constants;
    }
}
