package ch.skywatch.windoo.api;

abstract class EventDetect {
    public static final int CALIB = 1;
    public static final int HUMIDITY = 4;
    public static final int HUMIDITY_TEMP = 5;
    public static final int PRESSURE = 8;
    public static final int PRESSURE_1 = 6;
    public static final int PRESSURE_2 = 7;
    public static final int TEMP = 3;
    public static final int WIND = 2;
    private int type;

    public abstract Object getData();

    public EventDetect(int type) {
        this.type = type;
    }

    public int getType() {
        return this.type;
    }
}
