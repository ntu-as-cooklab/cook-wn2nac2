package ch.skywatch.windoo.api;

import android.media.AudioTrack;
import android.os.Process;

class ToolWaveGenerator {
    static final String TAG = "WaveGenerator";
    private static boolean active = true;
    private static double frequency = 15000.0d;
    private static ToolWaveGenerator instance = null;
    private AudioTrack audioTrack;
    private AudioTrack emptyTrack;
    private final byte[] generatedSnd = new byte[88200];
    private final int numSamples = 44100;
    private final double[] sample = new double[44100];

    protected ToolWaveGenerator() {
    }

    public static ToolWaveGenerator getInstance() {
        if (instance == null) {
            instance = new ToolWaveGenerator();
        }
        return instance;
    }

    private void refreshSound() {
        this.audioTrack = new AudioTrack(3, 44100, 4, 2, this.generatedSnd.length, 0);
        for (int i = 0; i < 44100; i++) {
            this.sample[i] = Math.sin((6.283185307179586d * ((double) i)) / (44100.0d / frequency));
        }
        int idx = 0;
        for (double dVal : this.sample) {
            short val = (short) ((int) (32767.0d * dVal));
            int i2 = idx + 1;
            this.generatedSnd[idx] = (byte) (val & 255);
            idx = i2 + 1;
            this.generatedSnd[i2] = (byte) ((65280 & val) >>> 8);
        }
        this.audioTrack.write(this.generatedSnd, 0, this.generatedSnd.length);
        this.audioTrack.setLoopPoints(0, this.generatedSnd.length / 2, -1);
    }

    public void start() {
        Process.setThreadPriority(-19);
        if (active) {
            if (this.emptyTrack != null && this.emptyTrack.getPlayState() == 3) {
                this.emptyTrack.stop();
            }
            refreshSound();
            this.audioTrack.play();
        }
    }

    public void startEmptySound() {
        if (active) {
            if (this.audioTrack != null && this.audioTrack.getPlayState() == 3) {
                this.audioTrack.stop();
            }
            refreshEmptySound();
            this.emptyTrack.play();
        }
    }

    public void stop() {
        if (active) {
            if (this.audioTrack != null) {
                if (this.audioTrack.getPlayState() == 3) {
                    this.audioTrack.stop();
                }
                this.audioTrack.release();
            }
            if (this.emptyTrack != null) {
                if (this.emptyTrack.getPlayState() == 3) {
                    this.emptyTrack.stop();
                }
                this.emptyTrack.release();
            }
        }
    }

    private void refreshEmptySound() {
        this.emptyTrack = new AudioTrack(3, 44100, 4, 2, this.generatedSnd.length, 0);
        int idx = 0;
        for (int i = 0; i < 44100; i++) {
            int idx2 = idx + 1;
            this.generatedSnd[idx] = (byte) 0;
            idx = idx2 + 1;
            this.generatedSnd[idx2] = (byte) 0;
        }
        this.emptyTrack.write(this.generatedSnd, 0, this.generatedSnd.length);
        this.emptyTrack.setLoopPoints(0, this.generatedSnd.length / 2, -1);
    }
}
