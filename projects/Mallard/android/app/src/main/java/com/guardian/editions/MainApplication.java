package com.guardian.editions;

import android.app.Application;

import com.guardian.editions.releasestream.ReleaseStreamPackage;

import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import io.sentry.react.RNSentryPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.guardian.editions.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import com.guardian.editions.ophan.RNOphanPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new RNOphanPackage());

            packages.add(new ReleaseStreamPackage());

            // packages.add(new MainReactPackage(),
            // packages.add(new RNDeviceInfo());
            // packages.add(new NetInfoPackage());
            // packages.add(new RNSentryPackage());
            // packages.add(new ReactNativePushNotificationPackage());
            // packages.add(new ReactNativeConfigPackage());
            // packages.add(new KeychainPackage());
            // packages.add(new RNCMaskedViewPackage());
            // packages.add(new RNCWebViewPackage());
            // packages.add(new RNZipArchivePackage());
            // packages.add(new SvgPackage());
            // packages.add(new AsyncStoragePackage());
            // packages.add(new RNFetchBlobPackage());
            // packages.add(new RNScreensPackage());
            // packages.add(new RNGestureHandlerPackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

    @Override
    public ReactNativeHost getReactNativeHost() {
      if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
        return mNewArchitectureNativeHost;
      } else {
        return mReactNativeHost;
      }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        // If you opted-in for the New Architecture, we enable the TurboModule system
        ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.guardian.editions.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
    }
}
