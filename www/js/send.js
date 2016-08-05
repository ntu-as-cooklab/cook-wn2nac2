function sendMeasurement()
{

    $.post( "http://mospc.cook.as.ntu.edu.tw/post4.php", JSON.parse(JSON.stringify(glbsens.currentMeasurement)),
        function( data ) {
            console.log(data);
        });
}

var lastMeasurement;

function getLastMeasurement()
{
    $.get( "http://mospc.cook.as.ntu.edu.tw/getlast.php", null, function( data ) {
  lastMeasurement = JSON.parse(data);
  console.log(lastMeasurement);
});
}
