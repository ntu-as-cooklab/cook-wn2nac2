/*var seconds = $('.progress-pie-chart').data('percent'),
    startTime = $('.progress-pie-chart').data('start-time');

  function countdown()
  {
    function tick() {
      seconds--;
      $('.progress-pie-chart').data('percent', seconds);

      drawCircle();
      if( seconds > 0 ) {
        setTimeout(tick, 1000);
      } else {
        //done
      }
    }
    tick();
}*/

function calculatePercent() { return parseInt($('.progress-pie-chart').data('percent')); }

function drawCircle()
{
    var deg = 360*(seconds/startTime), percent = calculatePercent();

    if (percent > (startTime/2))
        $('.progress-pie-chart').addClass('gt-50');
    else
        $('.progress-pie-chart').removeClass('gt-50');

    $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');

    //$('.ppc-percents span').html(percent+' sec');
}
