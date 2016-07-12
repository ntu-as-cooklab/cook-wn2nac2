#!/usr/bin/env node
var exec = require('child_process').exec;
exec("cordova plugin rm cook-plugin-wn2nac",
    function() { exec("cordova plugin add cook-plugin-wn2nac"); }
);
