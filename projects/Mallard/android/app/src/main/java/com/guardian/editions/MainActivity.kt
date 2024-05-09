package com.guardian.editions;

import android.annotation.SuppressLint;
import android.content.pm.ActivityInfo;
import android.content.Context
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import org.devio.rn.splashscreen.SplashScreen;
import android.util.Log

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Mallard"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun onCreate(savedInstanceState: Bundle?) {
                SplashScreen.show(this@MainActivity)  
                super.onCreate(savedInstanceState)
                if (!isTablet()) {
                    requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                }
            }
        }
    }

   fun isTablet(): Boolean {
        return getResources().getBoolean(R.bool.is_tablet)
    }

    // There is a known issue with androix 1.1.0 which cause webview to crash
    // This is a workaround for this bug (https://github.com/react-native-webview/react-native-webview/issues/858)
    // androidX bug: https://issuetracker.google.com/issues/141132133
    override fun applyOverrideConfiguration(overrideConfiguration: Configuration) {
        if (Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT <= 25) {
            return
        }
        super.applyOverrideConfiguration(overrideConfiguration)
    }
}