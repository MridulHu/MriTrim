# Firebase Auth
-keep class com.google.firebase.auth.** { *; }
-dontwarn com.google.firebase.auth.**

# Keep internal classes used by Firebase
-keep class com.google.android.gms.internal.** { *; }
-dontwarn com.google.android.gms.internal.**

# Google Play Services (needed by Firebase)
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# Needed if you're using Tasks API (commonly used by Firebase)
-keep class com.google.android.gms.tasks.** { *; }
-dontwarn com.google.android.gms.tasks.**

# JSON serialization (optional, but safe to include)
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# ffmpeg-kit react native support
-keep class com.arthenica.** { *; }
-dontwarn com.arthenica.**


-keep class com.facebook.react.** { *; }
-keep class com.facebook.soloader.** { *; }
