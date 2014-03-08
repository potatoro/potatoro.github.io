App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return { session: 25, break: 5 };
  }
});

App.IndexController = Ember.ObjectController.extend({

  actions: {
    startSession: function() { startTimer('session'); },
    startBreak: function() { startTimer('break'); }
  }

});

var timerInterval;

function startTimer(timer) {
  clearInterval(timerInterval);
  $('#session').text($('input[name="'+timer+'"]').val() + ':0')
  timerInterval = setInterval(function() {
    sessionTime = $('#session').text().split(':');
    minutes = sessionTime[0];
    seconds = sessionTime[1];

    if (seconds == '0') {
      seconds = 59;
      if (minutes != '0') { minutes--; }
    } else {
      seconds--;
    }

    $('#session').text(minutes + ':' + seconds);

    if (seconds == 0 && minutes == 0) { clearInterval(timerInterval); }
  }, 1000);
}
