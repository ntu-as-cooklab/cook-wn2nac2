package ch.skywatch.windoo.api;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

class ReceiverHeadset extends BroadcastReceiver {
    static final String TAG = "HeadsetReceiver";

    public static boolean connected = false;

    ReceiverHeadset() {
    }

    public void onReceive(Context context, Intent intent) {
        connected = intent.hasExtra("state") && intent.hasExtra("microphone") && intent.getIntExtra("state", 0) == 1 && intent.getIntExtra("microphone", 0) == 1;
        JDCWindooManager.getInstance().checkDongleConnection(context, connected);
    }
}
