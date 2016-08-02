function sendMeasurement()
{
    $.post( "http://mospc.cook.as.ntu.edu.tw/post.php", glbsens.currentMeasurement, function( data ) {
    //alert(data)
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
