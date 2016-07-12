package ch.skywatch.windoo.api;

class ToolConverter {
    private static ToolConverter instance = null;

    ToolConverter() {
    }

    public static ToolConverter getInstance() {
        if (instance == null) {
            instance = new ToolConverter();
        }
        return instance;
    }

    public double frequencyToWindSpeed(double frequency) {
        double windFrequency = frequency / 20.0d;
        double wind = windFrequency * (((((((-3.3857d * Math.pow(10.0d, -13.0d)) * Math.pow(windFrequency, 5.0d)) + ((4.384d * Math.pow(10.0d, -10.0d)) * Math.pow(windFrequency, 4.0d))) - ((2.1796d * Math.pow(10.0d, -7.0d)) * Math.pow(windFrequency, 3.0d))) + ((5.2009d * Math.pow(10.0d, -5.0d)) * Math.pow(windFrequency, 2.0d))) - ((6.044d * Math.pow(10.0d, -3.0d)) * windFrequency)) + (6.6953d * Math.pow(10.0d, -1.0d)));
        if (wind < 1.0d) {
            return 0.0d;
        }
        return wind;
    }

    public double frequencyToTemperature(double frequency) {
        return (3380.0d / Math.log((10.0d * frequency) / (10000.0d * Math.exp(-11.336575549220193d)))) - 273.15d;
    }

    public double frequencyToHumidity(double frequency) {
        return -6.0d + ((125.0d / Math.pow(2.0d, 16.0d)) * (frequency * 4.0d));
    }

    public double frequencyToHumidityTemp(double frequency) {
        return -46.85d + ((175.72d / Math.pow(2.0d, 16.0d)) * (frequency * 4.0d));
    }

    public double frequencyToPressure(double frequency) {
        return frequency / 10.0d;
    }
}
