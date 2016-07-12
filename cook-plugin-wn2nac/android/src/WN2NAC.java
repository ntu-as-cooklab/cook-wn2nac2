package tw.edu.ntu.as.cook;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;
import java.util.Observable;
import java.util.Observer;
import ch.skywatch.windoo.api.JDCWindooEvent;
import ch.skywatch.windoo.api.JDCWindooManager;

public class WN2NAC extends CordovaPlugin implements Observer
{
    private static Context context;
    private static WN2NAC instance = new WN2NAC(); // Singleton instance
    private static JDCWindooManager jdcWindooManager;
    private static CallbackContext callback;

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException
    {
        if      (action.equals("init"))
        {
            context = this.cordova.getActivity().getApplicationContext();
            jdcWindooManager = JDCWindooManager.getInstance();
            jdcWindooManager.setToken("4a38879a-ff50-4103-8f44-ab9a84b72c21");
            callbackContext.success("Windoo manager initialized.");
            return true;
        }
        else if (action.equals("start"))
        {
            jdcWindooManager.addObserver(instance);
            jdcWindooManager.enable(context);
            callbackContext.success("Windoo manager started.");
            return true;
        }
        else if (action.equals("stop"))
        {
            jdcWindooManager.disable(context);
            jdcWindooManager.deleteObserver(instance);
            callbackContext.success("Windoo manager stopped.");
            return true;
        }
        else if (action.equals("setCallback"))
        {
            callback = callbackContext;
            return true;
        }
        else
        {
            callbackContext.error("Invalid method.");
            return false;
        }
    }

    @Override
    public void update(Observable observable, final Object object)
    {
        if (callback != null)
        {
            try
            {
                final JDCWindooEvent windooEvent = (JDCWindooEvent) object;
                JSONObject parameter = new JSONObject();
                parameter.put("type", windooEvent.getType());
                parameter.put("data", windooEvent.getData());

                PluginResult result = new PluginResult(PluginResult.Status.OK, parameter);
                result.setKeepCallback(true);
                callback.sendPluginResult(result);
            }
            catch (JSONException e) {   Log.e("WN2NAC2", e.toString());   }
        }
    }
}
