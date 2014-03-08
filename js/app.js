App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {
      session: timerDuration('session'),
      break: timerDuration('break')
    };
  }
});

var runningFlow = false;

App.IndexController = Ember.ObjectController.extend({

  actions: {
    startSession: function() {
      saveDurationsInCookies();
      runningFlow = false;
      startTimer('session');
    },
    startBreak: function() {
      runningFlow = false;
      startTimer('break');
    },
    startFlow: function() {
      saveDurationsInCookies();
      runningFlow = true;
      startTimer('session');
    }
  }

});

function saveDurationsInCookies() {
  $.cookie('session-duration', $('input[name="session"]').val());
  $.cookie('break-duration', $('input[name="break"]').val());
}

var sounds = {
  session: new Audio("sounds/sessionEnd.ogg"),
  break: new Audio("sounds/breakEnd.ogg")
};

var flowStates = { session: 'break', break: 'session' }
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

      if (runningFlow) { startTimer(flowStates[timer]); }
    }
  }, 1000);
}

var defaultDurations = { session: 25, break: 5 };

function timerDuration(timer) {
  if ($.cookie(timer + '-duration')) {
    return $.cookie(timer + '-duration')
  } else {
    return defaultDurations[timer];
  }
}
