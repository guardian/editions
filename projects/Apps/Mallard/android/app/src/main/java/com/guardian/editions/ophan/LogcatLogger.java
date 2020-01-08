package com.guardian.editions.ophan;

import androidx.annotation.NonNull;
import android.util.Log;

import com.gu.ophan.Logger;

public class LogcatLogger implements Logger {
    @Override
    public void debug(@NonNull String tag, @NonNull String message) {
        Log.d(tag, message);
    }

    @Override
    public void warn(@NonNull String tag, @NonNull String message, Throwable error) {
        Log.w(tag, message, error);
    }
}