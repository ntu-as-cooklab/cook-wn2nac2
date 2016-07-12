/*global cordova, module*/

module.exports =
{
    init: function (successCallback = null, errorCallback = null)
    {
        console.log("wn2nac.init");
        cordova.exec(successCallback, errorCallback, "WN2NAC", "init", []);
    },

    start: function (successCallback = null, errorCallback = null)
    {
        console.log("wn2nac.start");
        cordova.exec(successCallback, errorCallback, "WN2NAC", "start", []);
    },

    stop: function (successCallback = null, errorCallback = null)
    {
        console.log("wn2nac.stop");
        cordova.exec(successCallback, errorCallback, "WN2NAC", "stop", []);
    },

    setCallback: function (callBack, errorCallback = null)
    {
        console.log("wn2nac.setCallback");
        cordova.exec(callBack, errorCallback, "WN2NAC", "setCallback", []);
    }
};
