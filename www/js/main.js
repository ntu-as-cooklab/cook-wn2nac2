"use strict";

var log = function(message)
{
    return function() { console.log(message); }
}

function main()
{
    wn2nac.init(log("Windoo intialized"));
    wn2nac.start(log("Windoo started"));
    wn2nac.setCallback(onEvent);
}
