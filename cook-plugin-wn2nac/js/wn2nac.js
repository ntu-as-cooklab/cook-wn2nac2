/*global cordova, module*/

module.exports =
{
    init: function (successCallback = null, errorCallback = null)
    {
        cordova.exec(successCallback, errorCallback, "WN2NAC", "init", []);
    },

    start: function (successCallback = null, errorCallback = null)
    {
        cordova.exec(successCallback, errorCallback, "WN2NAC", "start", []);
    },

    stop: function (successCallback = null, errorCallback = null)
    {
        cordova.exec(successCallback, errorCallback, "WN2NAC", "stop", []);
    },

    setCallback: function (callBack, errorCallback = null)
    {
        cordova.exec(callBack, errorCallback, "WN2NAC", "setCallback", []);
    }
};
