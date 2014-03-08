App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {
      session: timerDuration('session'),
      break: timerDuration('break')
    };
  }
});

App.IndexController = Ember.ObjectController.extend({

  actions: {
    startSession: function() {
      $.cookie('session-time', $('input[name="session"]').val());
      $.cookie('break-time', $('input[name="break"]').val());
      startTimer('session');
    },
    startBreak: function() { startTimer('break'); }
  }

});

var defaultDurations = { session: 25, break: 5 };
var sounds = {
  session: new Audio("sounds/sessionEnd.ogg"),
  break: new Audio("sounds/breakEnd.ogg")
};

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

    if (seconds == 0 && minutes == 0) {
      clearInterval(timerInterval);
      sounds[timer].play();
    }
  }, 10);
}

function timerDuration(timer) {
  if ($.cookie(timer + '-time')) {
    return $.cookie(timer + '-time')
  } else {
    return defaultDurations[timer];
  }
}
