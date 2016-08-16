function fakeMeasurement()
{
    glbsens.currentMeasurement = new WindooMeasurement();
    //glbsens.currentMeasurement.duration = 0;
    glbsens.currentMeasurement.start();
    glbsens.currentMeasurement.addWind(1.0);
    glbsens.currentMeasurement.addTemp(2.0);
    glbsens.currentMeasurement.addHumd(3.0);
    glbsens.currentMeasurement.addPres(4.0);
    glbsens.currentMeasurement.stop();
}

function fakeSensorEvent(eventType, data)
{
    onEvent({ type: eventType, data: data} );
}

function fakeWind(data)
{
    fakeSensorEvent(4, data);
}

function fakeTemp(data)
{
    fakeSensorEvent(5, data);
}

function fakeHumd(data)
{
    fakeSensorEvent(6, data);
}

function fakePres(data)
{
    fakeSensorEvent(7, data);
}

var fakeWindoo = function()
{

}

fakeWindoo.start = function()
{
    fakeWindoo.interval = setInterval(
        function() {
            if (windooStatus == 2) {
                fakeTemp(25 + Math.random() * 5);
                fakeHumd(50 + Math.random() * 25);
                fakePres(1000 + Math.random() * 25);
            }
        }
        , 3000);
    fakeWindoo.windInterval = setInterval(
        function() {
            if (windooStatus == 0) fakeSensorEvent(1);
            else if (windooStatus == 1) fakeSensorEvent(2);
            else if (windooStatus == 2) fakeWind(Math.random() * 10);
        }
        , 1000);
}

fakeWindoo.stop = function()
{
    fakeSensorEvent(0);
    clearInterval(fakeWindoo.interval);
    clearInterval(fakeWindoo.windInterval);
}
