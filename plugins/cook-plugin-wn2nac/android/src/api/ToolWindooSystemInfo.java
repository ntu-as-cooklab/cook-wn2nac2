package ch.skywatch.windoo.api;

import android.os.Build.VERSION;

class ToolWindooSystemInfo {
    ToolWindooSystemInfo() {
    }

    public static String getVersionOS() {
        return VERSION.SDK_INT + "/" + VERSION.RELEASE;
    }
}
