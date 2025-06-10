package com.mridul.mritrim;

import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.rnfs.RNFSPackage;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new RNFSPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    // SoLoader.init(this, false); is correctly used for New Architecture by default
    // as of RN 0.76+ when using DefaultReactNativeHost.
    // It's still good practice to have it, but for a simple app with DefaultReactNativeHost,
    // React Native often handles it. Keep it if it was explicitly added.
    SoLoader.init(this, false); // Initialize SoLoader first

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // REMOVED: System.loadLibrary("native-lib");
      DefaultNewArchitectureEntryPoint.load(); // This correctly loads New Architecture components
    }
  }
}