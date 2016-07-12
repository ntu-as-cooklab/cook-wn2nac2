package ch.skywatch.windoo.api;

public class JDCWindooEvent {
    public static final int JDCWindooAvailable = 1;
    public static final int JDCWindooCalibrated = 2;
    public static final int JDCWindooNewHumidityValue = 6;
    public static final int JDCWindooNewPressureValue = 7;
    public static final int JDCWindooNewTemperatureValue = 5;
    public static final int JDCWindooNewWindValue = 4;
    public static final int JDCWindooNotAvailable = 0;
    public static final int JDCWindooPublishException = 9;
    public static final int JDCWindooPublishSuccess = 8;
    public static final int JDCWindooVolumeNotAtItsMaximum = 3;
    protected Object data;
    protected int type;

    protected JDCWindooEvent() {}

    public JDCWindooEvent(int type) {
        this.type = type;
    }

    public JDCWindooEvent(int type, Object data) {
        this.type = type;
        this.data = data;
    }

    public int getType() {
        return this.type;
    }

    public Object getData() {
        return this.data;
    }
}
