package ch.skywatch.windoo.api;

import android.app.Activity;
import android.content.Context;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory;
import android.media.AudioManager;
import android.util.Log;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Observable;
import java.util.Observer;
import java.util.UUID;
import java.util.regex.Pattern;
/*import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;*/

public class JDCWindooManager extends Observable implements Observer {
    private static final int MAX_IMAGE_SIZE = 800;
    private static final String TAG = "JDCWindooManager";
    private static JDCWindooManager instance = null;
    private boolean active = false;
    private Context context;
    private ToolConverter convert = ToolConverter.getInstance();
    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ssZ");
    private ReceiverHeadset headsetReceiver;
    private ToolDataManager manager = ToolDataManager.getInstance();
    private ReceiverMediaButton mediaButtonReceiver;
    private ReceiverAudioBecomingNoisy noisyReveiverInstance;
    private String token;

    public void enable(Context activity) {
        this.context = activity;
        this.noisyReveiverInstance = new ReceiverAudioBecomingNoisy();
        activity.registerReceiver(this.noisyReveiverInstance, new IntentFilter("android.media.AUDIO_BECOMING_NOISY"));
        this.headsetReceiver = new ReceiverHeadset();
        activity.registerReceiver(this.headsetReceiver, new IntentFilter("android.intent.action.HEADSET_PLUG"));
        this.mediaButtonReceiver = new ReceiverMediaButton();
        activity.registerReceiver(this.mediaButtonReceiver, new IntentFilter("android.media.VOLUME_CHANGED_ACTION"));
        //startDongleCommunication();
    }

    public void disable(Context activity) {
        activity.unregisterReceiver(this.noisyReveiverInstance);
        activity.unregisterReceiver(this.headsetReceiver);
        activity.unregisterReceiver(this.mediaButtonReceiver);
        stopDongleCommunication();
    }

    public void setToken(String token) {
        this.token = token;
    }

    public JDCWindooMeasurement getLive() {
        ToolDataManager data = ToolDataManager.getInstance();
        JDCWindooMeasurement measurement = new JDCWindooMeasurement();
        measurement.setWind(data.getWindMeasure());
        measurement.setTemperature(data.getTempMeasure());
        measurement.setHumidity(data.getHumidityMeasure());
        measurement.setPressure(data.getPressureMeasure());
        return measurement;
    }

    private JDCWindooManager() {
        this.dateFormat.setTimeZone(Calendar.getInstance().getTimeZone());
    }

    public static JDCWindooManager getInstance() {
        if (instance == null) {
            instance = new JDCWindooManager();
        }
        return instance;
    }

    protected void checkDongleConnection(Context context, boolean connected) {
        if (connected) {
            soundVolumeUp(context);
            checkVolume(context);
            return;
        }
        setChanged();
        notifyObservers(new JDCWindooEvent(0));
        if (this.active) {
            stopDongleCommunication();
        }
    }

    protected void checkVolume(Context context) {
        AudioManager audio = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        if (audio.getStreamVolume(3) >= audio.getStreamMaxVolume(3)) {
            setChanged();
            notifyObservers(new JDCWindooEvent(1));
            if (!this.active) {
                startDongleCommunication();
            }
        } else if (this.active) {
            setChanged();
            notifyObservers(new JDCWindooEvent(3));
            stopDongleCommunication();
            ToolWaveGenerator.getInstance().startEmptySound();
        }
    }

    private void scaleDown(String inPath, String outPath, float maxImageSize, boolean filter) {
        Bitmap realImage = BitmapFactory.decodeFile(inPath);
        float ratio = Math.min(maxImageSize / ((float) realImage.getWidth()), maxImageSize / ((float) realImage.getHeight()));
        Bitmap newBitmap = Bitmap.createScaledBitmap(realImage, Math.round(((float) realImage.getWidth()) * ratio), Math.round(((float) realImage.getHeight()) * ratio), filter);
        try {
            FileOutputStream out = new FileOutputStream(outPath);
            newBitmap.compress(CompressFormat.PNG, 90, out);
            out.close();
        } catch (IOException e) {
            Log.e(TAG, e.toString());
        }
    }

    private void soundVolumeUp(Context context) {
        AudioManager audio = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        int lvl = audio.getStreamMaxVolume(3);
        int lvlBefore = audio.getStreamVolume(3);
        int lvlAfter = -1;
        while (audio.getStreamVolume(3) < lvl && lvlBefore != lvlAfter) {
            lvlBefore = audio.getStreamVolume(3);
            audio.adjustStreamVolume(3, 1, 0);
            lvlAfter = audio.getStreamVolume(3);
        }
    }

    public void update(Observable observable, Object object) {
        EventDetect event = (EventDetect) object;
        double value;
        if (event.getType() == 2) {
            value = this.convert.frequencyToWindSpeed((Double) event.getData());
            if (this.manager.filterWind(value)) {
                this.manager.setWindMeasure(value);
                Log.d(TAG, "New Wind: " + value);
                setChanged();
                notifyObservers(new JDCWindooEvent(4, value));
            }
        } else if (event.getType() == 3) {
            value = this.convert.frequencyToTemperature((Double) event.getData());
            if (this.manager.filterTemperature(value)) {
                this.manager.setTempMeasure(value);
                Log.d(TAG, "New Temperature: " + value);
                setChanged();
                notifyObservers(new JDCWindooEvent(5, value));
            }
        } else if (event.getType() == 5) {
            value = this.convert.frequencyToHumidityTemp((Double) event.getData());
            if (this.manager.filterTemperature(value)) {
                this.manager.setTempMeasure(value);
                Log.d(TAG, "New Temperature: " + value);
                setChanged();
                notifyObservers(new JDCWindooEvent(5, value));
            }
        } else if (event.getType() == 4) {
            value = this.convert.frequencyToHumidity((Double) event.getData());
            if (this.manager.filterHumidity(value)) {
                this.manager.setHumidityMeasure(value);
                Log.d(TAG, "New Humidity: " + value);
                setChanged();
                notifyObservers(new JDCWindooEvent(6, value));
            }
        } else if (event.getType() == 8) {
            value = this.convert.frequencyToPressure((Double) event.getData());
            if (this.manager.filterPressure(value)) {
                this.manager.setPressureMeasure(value);
                Log.d(TAG, "New Pressure: " + value);
                setChanged();
                notifyObservers(new JDCWindooEvent(7, value));
            }
        } else if (event.getType() == 1 && !(Boolean) event.getData()) {
            setChanged();
            notifyObservers(new JDCWindooEvent(2));
        }
    }

    private void startDongleCommunication() {
        this.active = true;
        ToolWaveAnalysis.getInstance().addObserver(this);
        ToolWaveAnalysis.getInstance().start();
        ToolWaveGenerator.getInstance().start();
    }

    private void stopDongleCommunication() {
        this.active = false;
        ToolWaveAnalysis.getInstance().stop();
        ToolWaveGenerator.getInstance().stop();
    }

    private boolean isTokenValid() {
        if (this.token == null) {
            return false;
        }
        return Pattern.matches("[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}", this.token);
    }

    /*private JSONObject httpResponseToJSONObject(HttpResponse httpResponse) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));
        StringBuilder builder = new StringBuilder();
        while (true) {
            String line = reader.readLine();
            if (line == null) {
                return new JSONObject(builder.toString());
            }
            builder.append(line).append("\n");
        }
    }*/

    /*public void publishMeasure(JDCWindooMeasurement measure) {
        if (isTokenValid()) {
            HttpPost httpPost = new HttpPost(this.context.getString(R.string.url_server) + this.context.getString(R.string.url_api) + this.token + ".json");
            httpPost.setHeader("Accept-Language", "en-US");
            httpPost.setHeader("User-Agent", "Android;" + ToolWindooSystemInfo.getVersionOS() + ";API v" + R.string.api_version);
            MultipartEntityBuilder multipartEntity = MultipartEntityBuilder.create();
            multipartEntity.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            multipartEntity.addTextBody("measurement[wind]", measure.getWind().toString());
            multipartEntity.addTextBody("measurement[temperature]", measure.getTemperature().toString());
            if (measure.hasHumidity()) {
                multipartEntity.addTextBody("measurement[humidity]", measure.getHumidity().toString());
            }
            if (measure.hasPressure()) {
                multipartEntity.addTextBody("measurement[pressure]", measure.getPressure().toString());
            }
            if (measure.hasNickname()) {
                multipartEntity.addTextBody("measurement[nickname]", measure.getNickname());
            }
            if (measure.hasEmail()) {
                multipartEntity.addTextBody("measurement[email]", measure.getEmail());
            }
            if (measure.hasPicture()) {
                ToolWindooFileManager fileManager = ToolWindooFileManager.getInstance();
                new File(fileManager.getFolderPath()).mkdirs();
                String pictureName = UUID.randomUUID().toString();
                File picture = new File(fileManager.getNewFilePath(pictureName));
                try {
                    picture.createNewFile();
                    scaleDown(measure.getPicture().getAbsolutePath(), picture.getAbsolutePath(), 800.0f, true);
                    multipartEntity.addTextBody("measurement[pictureGUID]", pictureName);
                    multipartEntity.addPart("measurement[image]", new FileBody(picture));
                } catch (Exception e) {
                    e.printStackTrace();
                    setChanged();
                    notifyObservers(new JDCWindooEvent(9, "UNKNOWN_ERROR: " + e.getMessage()));
                    return;
                }
            }
            if (measure.hasLocation()) {
                multipartEntity.addTextBody("measurement[latitude]", measure.getLatitude().toString());
                multipartEntity.addTextBody("measurement[longitude]", measure.getLongitude().toString());
                multipartEntity.addTextBody("measurement[accuracy]", measure.getAccuracy().toString());
                multipartEntity.addTextBody("measurement[speed]", measure.getSpeed().toString());
                multipartEntity.addTextBody("measurement[orientation]", measure.getOrientation().toString());
            }
            if (measure.hasAltitude()) {
                multipartEntity.addTextBody("measurement[altitude]", measure.getAltitude().toString());
            }
            if (measure.getCreatedAt() != null) {
                multipartEntity.addTextBody("measurement[created_at]", this.dateFormat.format(measure.getCreatedAt()));
                Log.e(TAG, this.dateFormat.format(measure.getCreatedAt()));
            } else {
                multipartEntity.addTextBody("measurement[created_at]", this.dateFormat.format(new Date()));
                Log.e(TAG, this.dateFormat.format(new Date()));
            }
            httpPost.setEntity(multipartEntity.build());
            try {
                HttpResponse httpResponse = new DefaultHttpClient().execute(httpPost);
                JSONObject result;
                if (httpResponse.getStatusLine().getStatusCode() == 200) {
                    result = httpResponseToJSONObject(httpResponse);
                    setChanged();
                    notifyObservers(new JDCWindooEvent(8, result.get("measurement")));
                    return;
                } else if (httpResponse.getStatusLine().getStatusCode() == 400) {
                    result = httpResponseToJSONObject(httpResponse);
                    setChanged();
                    notifyObservers(new JDCWindooEvent(9, ((JSONObject) result.get("error")).get("status")));
                    return;
                } else if (httpResponse.getStatusLine().getStatusCode() == 408) {
                    setChanged();
                    notifyObservers(new JDCWindooEvent(9, "TIMEOUT_ERROR"));
                    return;
                } else {
                    setChanged();
                    notifyObservers(new JDCWindooEvent(9, "SERVER_ERROR"));
                    return;
                }
            } catch (Exception e2) {
                setChanged();
                notifyObservers(new JDCWindooEvent(9, "UNKNOWN_ERROR: " + e2.getMessage()));
                return;
            }
        }
        setChanged();
        notifyObservers(new JDCWindooEvent(9, "TOKEN_ERROR"));
    }*/
}
