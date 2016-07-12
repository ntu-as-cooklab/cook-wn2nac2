package ch.skywatch.windoo.api;

class ToolDataManager {
    private static final int COUNT_TEMP_DEFAULT = 2;
    private static final int COUNT_WIND_DEFAULT = 3;
    private static final int MAX_TEMP_GAP = 10;
    private static final String TAG = "DataManager";
    private static ToolDataManager instance = null;
    private int countTemp = COUNT_TEMP_DEFAULT;
    private int countWind = COUNT_WIND_DEFAULT;
    private Double humidity;
    public final int humidityMax = 100;
    public final int humidityMin = 0;
    private Double pressure;
    public final int pressureMax = 1100;
    public final int pressureMin = 200;
    private Double smoothingHumidity;
    private Double smoothingPressure;
    private Double smoothingTemp;
    private Double smoothingWind;
    private Double temp;
    public final int tempMax = 60;
    public final int tempMin = -25;
    private Double wind;
    public final int windMax = 150;
    public final int windMin = 0;

    protected ToolDataManager() {
    }

    public static ToolDataManager getInstance() {
        if (instance == null) {
            instance = new ToolDataManager();
        }
        return instance;
    }

    public Double getWindMeasure() {
        return this.wind;
    }

    public void setWindMeasure(double value) {
        this.wind = value;
        if (value == -0.0d) {
            this.wind = 0.0d;
        }
    }

    public Double getTempMeasure() {
        return this.temp;
    }

    public void setTempMeasure(double value) { this.temp = value; }

    public Double getHumidityMeasure() {
        return this.humidity;
    }

    public void setHumidityMeasure(double value) { this.humidity = value; }

    public Double getPressureMeasure() {
        return this.pressure;
    }

    public void setPressureMeasure(double value) {
        this.pressure = value;
    }

    public boolean filterWind(Double value) {
        if (value >= 0.0d && value <= 150.0d) {
            if (this.smoothingWind == null) {
                this.smoothingWind = value;
                return true;
            }
            int indexWindMaxGapValue;
            if (value < 40.0d) {
                indexWindMaxGapValue = 0;
            } else if (value < 60.0d) {
                indexWindMaxGapValue = 1;
            } else if (value < 80.0d) {
                indexWindMaxGapValue = COUNT_TEMP_DEFAULT;
            } else if (value < 100.0d) {
                indexWindMaxGapValue = COUNT_WIND_DEFAULT;
            } else {
                indexWindMaxGapValue = 4;
            }
            Boolean gapIsTooLarge = Boolean.valueOf(Math.abs(value.doubleValue() - this.smoothingWind.doubleValue()) > ((double) new Integer[]{Integer.valueOf(30), Integer.valueOf(25), Integer.valueOf(20), Integer.valueOf(15), Integer.valueOf(MAX_TEMP_GAP)}[indexWindMaxGapValue].intValue()));
            if (!gapIsTooLarge) {
                this.countWind = COUNT_WIND_DEFAULT;
                this.smoothingWind = value;
                return true;
            } else if (this.countWind <= 0) {
                this.countWind = COUNT_WIND_DEFAULT;
                this.smoothingWind = value;
                return false;
            } else if (gapIsTooLarge) {
                this.countWind--;
                return false;
            }
        }
        return false;
    }

    public boolean filterTemperature(Double value) {
        if (this.smoothingTemp == null) {
            this.smoothingTemp = value;
            return true;
        }
        boolean z;
        if (Double.valueOf(Math.abs(this.smoothingTemp.doubleValue() - value.doubleValue())).doubleValue() > 10.0d) {
            z = true;
        } else {
            z = false;
        }
        Boolean gapIsTooLarge = Boolean.valueOf(z);
        if (!gapIsTooLarge.booleanValue()) {
            this.countTemp = COUNT_TEMP_DEFAULT;
            this.smoothingTemp = value;
            return true;
        } else if (gapIsTooLarge.booleanValue() && this.countTemp == 0) {
            this.countTemp = COUNT_TEMP_DEFAULT;
            this.smoothingTemp = value;
            return true;
        } else if (!gapIsTooLarge.booleanValue()) {
            return false;
        } else {
            this.countTemp--;
            return false;
        }
    }

    public boolean filterHumidity(Double value) {
        if (this.smoothingHumidity == null) {
            this.smoothingHumidity = value;
            return true;
        } else if (value.doubleValue() < 0.0d || value.doubleValue() > 100.0d) {
            return false;
        } else {
            return true;
        }
    }

    public boolean filterPressure(Double value) {
        if (this.smoothingPressure == null) {
            this.smoothingPressure = value;
            return true;
        } else if (value.doubleValue() < 200.0d || value.doubleValue() > 1100.0d) {
            return false;
        } else {
            return true;
        }
    }
}
