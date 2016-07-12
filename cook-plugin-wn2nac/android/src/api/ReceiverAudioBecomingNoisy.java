package ch.skywatch.windoo.api;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

class ReceiverAudioBecomingNoisy extends BroadcastReceiver {
    static final String TAG = "AudioBecomingNoisyReveiver";

    ReceiverAudioBecomingNoisy() {
    }

    public void onReceive(Context context, Intent intent) {
        JDCWindooManager.getInstance().checkDongleConnection(context, false);
    }
}
