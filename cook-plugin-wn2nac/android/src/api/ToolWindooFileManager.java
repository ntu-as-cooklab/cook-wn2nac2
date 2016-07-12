package ch.skywatch.windoo.api;

import android.os.Environment;
import java.io.File;

class ToolWindooFileManager {
    public static final String APPS_DATA_PATH = ("Android" + File.separator + "data");
    public static final String APP_DIRECTORY_PICTURES = "Pictures";
    public static final String APP_PATH = "ch.skywatch.windooapidemo";
    public static final String FILE_EXTENTION = ".jpg";
    private static ToolWindooFileManager instance = null;
    private static String pathDataApp;

    protected ToolWindooFileManager() {
        pathDataApp = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + APPS_DATA_PATH + File.separator + APP_PATH;
    }

    public static ToolWindooFileManager getInstance() {
        if (instance == null) {
            instance = new ToolWindooFileManager();
        }
        return instance;
    }

    public String getFolderPath() {
        return pathDataApp + File.separator + APP_DIRECTORY_PICTURES;
    }

    public String getNewFilePath(String uuid) {
        return getFolderPath() + File.separator + uuid + FILE_EXTENTION;
    }
}
