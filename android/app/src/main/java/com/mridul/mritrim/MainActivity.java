package com.mridul.mritrim;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;

public class MainActivity extends ReactActivity {

  // REMOVED: static { System.loadLibrary("native-lib"); }

  // REMOVED: public native String stringFromJNI();
  // REMOVED: public native void nativeLogMessage();

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);

    // REMOVED: Calls to native methods
    // REMOVED: String message = stringFromJNI();
    // REMOVED: Log.d("NativeMessage", message);
    // REMOVED: nativeLogMessage();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

  @Override
  protected String getMainComponentName() {
    return "MriTrim";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
      this,
      getMainComponentName(),
      DefaultNewArchitectureEntryPoint.getFabricEnabled()
    );
  }
}