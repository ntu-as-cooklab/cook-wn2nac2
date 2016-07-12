package ch.skywatch.windoo.api;

class EventDetectFrequency extends EventDetect {
    private double data;

    public EventDetectFrequency(int type, double data) {
        super(type);
        this.data = data;
    }

    public Double getData() {
        return new Double(this.data);
    }
}
