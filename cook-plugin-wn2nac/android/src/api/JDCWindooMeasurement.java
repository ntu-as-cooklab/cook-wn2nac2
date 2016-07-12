package ch.skywatch.windoo.api;

import java.io.File;
import java.text.NumberFormat;
import java.util.Date;

public class JDCWindooMeasurement {
    static final String TAG = "Measure";
    private Float accuracy;
    private Double altitude;
    private Date createdAt;
    private String email;
    private NumberFormat formatter = NumberFormat.getInstance();
    private Double humidity;
    private Double latitude;
    private Double longitude;
    private String nickname;
    private Float orientation;
    private File picture;
    private String pictureGuid;
    private Double pressure;
    private Float speed;
    private Double temperature;
    private Date updatedAt;
    private Double wind;

    public JDCWindooMeasurement() {
        this.formatter.setMinimumFractionDigits(2);
        this.formatter.setMaximumFractionDigits(2);
    }

    public boolean hasPressure() {
        return this.pressure != null;
    }

    public boolean hasHumidity() {
        return this.humidity != null;
    }

    public boolean hasPicture() {
        return this.picture != null;
    }

    public boolean hasLocation() {
        return !(this.latitude == null || this.longitude == null);
    }

    public boolean hasAltitude() {
        return this.altitude != null;
    }

    public boolean hasNickname() {
        return !(this.nickname == null);
    }

    public boolean hasEmail() {
        return this.email != null;
    }

    public boolean hasWindSpeed() {
        return getWind() != null;
    }

    public boolean hasTemperature() {
        return getTemperature() != null;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getWind() {
        return this.wind;
    }

    public void setWind(Double wind) {
        this.wind = wind;
    }

    public Double getTemperature() {
        return this.temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return this.humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getPressure() {
        return this.pressure;
    }

    public void setPressure(Double pressure) {
        this.pressure = pressure;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Float getOrientation() {
        return this.orientation;
    }

    public void setOrientation(Float orientation) {
        this.orientation = orientation;
    }

    public Float getAccuracy() {
        return this.accuracy;
    }

    public void setAccuracy(Float accuracy) {
        this.accuracy = accuracy;
    }

    public Double getAltitude() {
        return this.altitude;
    }

    public void setAltitude(Double altitude) {
        this.altitude = altitude;
    }

    public Float getSpeed() {
        return this.speed;
    }

    public void setSpeed(Float speed) {
        this.speed = speed;
    }

    public String getNickname() {
        return this.nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public File getPicture() {
        return this.picture;
    }

    public void setPicture(File picture) {
        this.picture = picture;
    }

    public String getPictureGuid() {
        return this.pictureGuid;
    }

    public void setPictureGuid(String pictureGuid) {
        this.pictureGuid = pictureGuid;
    }

    public String toString() {
        StringBuilder b = new StringBuilder();
        b.append("Wind: " + this.formatter.format(this.wind));
        b.append(" / Temperature: " + this.formatter.format(this.temperature));
        if (hasHumidity()) {
            b.append(" / Humidity: " + this.formatter.format(this.humidity));
        }
        if (hasPressure()) {
            b.append(" / Pressure: " + this.formatter.format(this.pressure));
        }
        return b.toString();
    }
}
