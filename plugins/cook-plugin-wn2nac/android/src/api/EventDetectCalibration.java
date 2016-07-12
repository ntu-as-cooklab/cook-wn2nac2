package ch.skywatch.windoo.api;

class EventDetectCalibration extends EventDetect {
    private boolean calibrating;

    public EventDetectCalibration(int type, boolean calibrating) {
        super(type);
        this.calibrating = calibrating;
    }

    public Boolean getData() {
        return Boolean.valueOf(this.calibrating);
    }
}
