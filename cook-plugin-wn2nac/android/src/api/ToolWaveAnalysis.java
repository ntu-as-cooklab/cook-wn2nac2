package ch.skywatch.windoo.api;

import android.media.AudioRecord;
import android.os.Process;
import android.util.Log;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.Observable;

class ToolWaveAnalysis extends Observable implements Runnable {
    private static final int DONGLE_TYPE = 0;
    private static final String TAG = "WaveAnalysis";
    private static ToolWaveAnalysis instance = null;
    private final int DATA_HUMIDITY_MAX = 15000;
    private final int DATA_HUMIDITY_MIN = 1900;
    private final int DATA_HUMIDITY_TEMP_MAX = 11000;
    private final int DATA_HUMIDITY_TEMP_MIN = 3500;
    private final int DATA_MAX = 20000;
    private final int DATA_MIN = 900;
    private final int DATA_PRESSURE_MAX = 12000;
    private final int DATA_PRESSURE_MIN = 3000;
    private final int DATA_TEMP_MAX = 9000;
    private final int DATA_TEMP_MIN = 1400;
    private final int DATA_WIND_MAX = 4000;
    private final int DATA_WIND_MIN = 1020;
    private final int HEADER_CALIB = 500;
    private final int HEADER_CALIB_MAX = 520;
    private final int HEADER_CALIB_MIN = 480;
    private final int HEADER_HUMIDITY = 650;
    private final int HEADER_HUMIDITY_MAX = 670;
    private final int HEADER_HUMIDITY_MIN = 630;
    private final int HEADER_HUMIDITY_TEMP = 700;
    private final int HEADER_HUMIDITY_TEMP_MAX = 720;
    private final int HEADER_HUMIDITY_TEMP_MIN = 680;
    private final int HEADER_MAX = 900;
    private final int HEADER_MIN = 100;
    private final int HEADER_PRESSURE_1 = 750;
    private final int HEADER_PRESSURE_1_MAX = 770;
    private final int HEADER_PRESSURE_1_MIN = 730;
    private final int HEADER_PRESSURE_2 = 800;
    private final int HEADER_PRESSURE_2_MAX = 820;
    private final int HEADER_PRESSURE_2_MIN = 780;
    private final int HEADER_TEMP = 600;
    private final int HEADER_TEMP_MAX = 620;
    private final int HEADER_TEMP_MIN = 580;
    private final int HEADER_WIND = 550;
    private final int HEADER_WIND_MAX = 570;
    private final int HEADER_WIND_MIN = 530;
    private final int LIMITS = 20;
    private Thread activity;
    private int bufferSize = 2048;
    private double calibValue = 1000.0d;
    private ArrayList<Double> calibValues = new ArrayList<Double>();
    private int fftBins = 32768;
    private Integer lastHumidityGenerated;
    private Integer lastHumidityTempGenerated;
    private Integer lastPressureGenerated;
    private Integer lastTempGenerated;
    private Integer lastWindGenerated;
    double pres1_corr = 0.0d;
    double pres2_corr = 0.0d;
    private boolean running;
    private int sampleRate = 44100;

    protected ToolWaveAnalysis() {
    }

    public static ToolWaveAnalysis getInstance() {
        if (instance == null) {
            instance = new ToolWaveAnalysis();
        }
        return instance;
    }

    public synchronized boolean isRunning() {
        return this.running;
    }

    private synchronized void setRunning(boolean b) {
        this.running = b;
    }

    public void start() {
        if (!isRunning()) {
            setRunning(true);
            this.activity = new Thread(this);
            this.activity.start();
        }
    }

    public void stop() {
        setRunning(false);
    }

    public void run() {
        Process.setThreadPriority(-19);
        int currentMeasureType = DONGLE_TYPE;
        ArrayList<Double> data = new ArrayList<>();
        ArrayList<Double> header = new ArrayList<>();
        AudioRecord audioRecord = new AudioRecord(1, this.sampleRate, 16, 2, Math.max(AudioRecord.getMinBufferSize(this.sampleRate, 16, 2), this.bufferSize * 2));
        FFTRealDouble fft = new FFTRealDouble(this.fftBins);
        double[] fftData = new double[this.fftBins];
        short[] audioSamples = new short[this.fftBins];
        audioRecord.startRecording();
        while (isRunning()) {
            audioRecord.read(audioSamples, DONGLE_TYPE, this.bufferSize);
            shortToDouble(audioSamples, fftData);
            fft.ft(fftData);
            double f = getFrequency(fftData);
            if (f >= 100.0d && f < 900.0d) {
                header.add(f);
                if (currentMeasureType != 0 && data.size() > 0) {
                    finalizeData(currentMeasureType, data);
                    data.clear();
                }
            } else if (f >= 900.0d && f <= 20000.0d) {
                data.add(f);
                if (header.size() > 0) {
                    currentMeasureType = finalizeHeader(header);
                    header.clear();
                }
            }
        }
        audioRecord.stop();
        audioRecord.release();
    }

    private int finalizeHeader(ArrayList<Double> header) {
        Collections.sort(header);
        double f = header.get(header.size() / 2);
        if (f >= 480.0d && f <= 520.0d) {
            return 1;
        }
        if (f >= 530.0d && f <= 570.0d) {
            return 2;
        }
        if (f >= 580.0d && f <= 620.0d) {
            return 3;
        }
        if (f >= 630.0d && f <= 670.0d) {
            return 4;
        }
        if (f >= 680.0d && f <= 720.0d) {
            return 5;
        }
        if (f >= 730.0d && f <= 770.0d) {
            return 6;
        }
        if (f < 780.0d || f > 820.0d) {
            return DONGLE_TYPE;
        }
        return 7;
    }

    private void finalizeData(int currentMeasureType, ArrayList<Double> data) {
        Collections.sort(data);
        double f = data.get(data.size() / 2);
        if (getStandardDeviation(data) >= 1000.0d) {
        }
        if (currentMeasureType == 1) {
            this.calibValues.add(f);
            setChanged();
            notifyObservers(new EventDetectCalibration(1, true));
            return;
        }
        if (currentMeasureType != 1 && this.calibValues.size() > 0) {
            Collections.sort(this.calibValues);
            this.calibValue = this.calibValues.get(this.calibValues.size() / 2);
            this.calibValues.clear();
            setChanged();
            notifyObservers(new EventDetectCalibration(1, false));
        }
        f = ((f / this.calibValue) * 1000.0d) - 1000.0d;
        if (currentMeasureType == 6) {
            this.pres1_corr = f;
        } else if (currentMeasureType == 7) {
            this.pres2_corr = f;
            Double pressure = (100.0d * ((double) Math.round(this.pres1_corr / 100.0d))) + (this.pres2_corr / 100.0d);
            this.pres1_corr = 0.0d;
            this.pres2_corr = 0.0d;
            setChanged();
            notifyObservers(new EventDetectFrequency(8, pressure.doubleValue()));
        } else {
            setChanged();
            notifyObservers(new EventDetectFrequency(currentMeasureType, f));
        }
    }

    private double[] shortToDouble(short[] s, double[] d) {
        for (int i = DONGLE_TYPE; i < d.length; i++) {
            d[i] = (double) s[i];
        }
        return d;
    }

    private Double getFrequency(double[] fftData) {
        double maxVal = -1.0d;
        int maxIndex = -1;
        for (int j = DONGLE_TYPE; j < fftData.length / 2; j++) {
            double re = fftData[j * 2];
            double im = fftData[(j * 2) + 1];
            double magnitude = Math.sqrt((re * re) + (im * im));
            if (magnitude > maxVal) {
                maxIndex = j;
                maxVal = magnitude;
            }
        }
        return ((double) (this.sampleRate * maxIndex)) / ((double) fftData.length);
    }

    private double getAverage(ArrayList<Double> values) {
        double sum;
        Iterator i$;
        if (values.size() >= 4) {
            sum = 0.0d;
            int i = DONGLE_TYPE;
            i$ = values.iterator();
            while (i$.hasNext()) {
                double a = (Double) i$.next();
                if (!(i == 0 || i == values.size() - 1)) {
                    sum += a;
                }
                i++;
            }
            return sum / ((double) (values.size() - 2));
        }
        sum = 0.0d;
        i$ = values.iterator();
        while (i$.hasNext()) {
            sum += (Double) i$.next();
        }
        return sum / ((double) values.size());
    }

    private double getStandardDeviation(ArrayList<Double> values) {
        double sum = 0.0d;
        Iterator i$ = values.iterator();
        while (i$.hasNext()) {
            sum += (Double) i$.next();
        }
        double mean = sum / ((double) values.size());
        sum = 0.0d;
        i$ = values.iterator();
        while (i$.hasNext()) {
            double a = (Double) i$.next();
            sum += (mean - a) * (mean - a);
        }
        return Math.sqrt(sum) / ((double) values.size());
    }

    private int random(int lower, int higher) {
        return ((int) (Math.random() * ((double) (higher - lower)))) + lower;
    }

    private int generateNextValue(Integer lastValue, int min, int max) {
        if (lastValue == null) {
            return random(min, max);
        }
        int diff = random(-25, 25);
        if (lastValue + diff < min || lastValue + diff > max) {
            return lastValue + (-diff);
        }
        return lastValue + diff;
    }

    private void simulate() {
        try {
            setChanged();
            this.lastWindGenerated = generateNextValue(this.lastWindGenerated, 1020, 4000);
            notifyObservers(new EventDetectFrequency(2, (double) this.lastWindGenerated));
            Thread.sleep(300);
        } catch (Exception e) {
            Log.e(TAG, "Can't sleep!");
        }
    }
}
