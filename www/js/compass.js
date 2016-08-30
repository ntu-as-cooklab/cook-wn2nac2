// Compass
console.log('compass work');

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     function onSuccess(heading) {
//         var compassDisc = document.getElementById("compassDiscImg");
//         var dir = heading.trueHeading;
//         console.log(dir);
//         compassDisc.style.Transform = 'rotate(' + dir + 'deg)';
//         compassDisc.style.WebkitTransform = 'rotate(' + (dir-270) + 'deg)';
//         compassDisc.style.MozTransform = 'rotate(-' + dir + 'deg)';
//     };
//
//     function onError(compassError) {
//         console.log('Compass error: ' + compassError.code);
//     };
//
//     var options = {
//         frequency: 100
//     }; // Update every 3 seconds

//     var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
// }


document.addEventListener("DOMContentLoaded", function(event) {

    if (window.DeviceOrientationEvent) {
         window.addEventListener('deviceorientation', function(eventData) {

             document.addEventListener("deviceready", onDeviceReady, false);
             function onDeviceReady() {
                 function onSuccess(heading) {
                     var compassDisc = document.getElementById("compassDiscImg");
                     var dir = heading.trueHeading;
                     glb.winDir = dir;
                     //console.log(dir);
                     var _dir = 360-dir; // compass disc is reversed to phone
                     compassDisc.style.Transform = 'rotate(' + _dir + 'deg)';
                     compassDisc.style.WebkitTransform = 'rotate(' + _dir + 'deg)';
                     compassDisc.style.MozTransform = 'rotate(' + _dir + 'deg)';
                 };

                 function onError(compassError) {
                     console.log('Compass error: ' + compassError.code);
                 };

                 navigator.compass.getCurrentHeading(onSuccess, onError);
             }
                // var alpha;
                // //Check for iOS property
                // if (eventData.webkitCompassHeading) {
                //     alpha = eventData.webkitCompassHeading;
                //     //Rotation is reversed for iOS
                //     // compassDisc.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
                // }
                // //non iOS
                // else {
                //     alpha = eventData.alpha;
                //     webkitAlpha = alpha;
                //     if (!window.chrome) {
                //         //Assume Android stock (this is crude, but good enough for our example) and apply offset
                //         webkitAlpha = alpha - 270;
                //     }
                // }
                // console.log( alpha+'---');
                // // compassDisc.style.Transform = 'rotate(' + alpha + 'deg)';
                // // compassDisc.style.WebkitTransform = 'rotate(' + webkitAlpha + 'deg)';
                // // //Rotation is reversed for FF
                // // compassDisc.style.MozTransform = 'rotate(-' + alpha + 'deg)';

         }, false);
    };
});
