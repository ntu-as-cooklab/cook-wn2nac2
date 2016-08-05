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
