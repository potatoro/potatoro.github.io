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
    },
    stopTimer: function() {
      runningFlow = false;
      stopTimer('session', true);
    }
  }

});

function saveDurationsInCookies() {
  $.cookie('session-duration', $('input[name="session"]').val());
  $.cookie('break-duration', $('input[name="break"]').val());
}

var timerInterval;
var timeLeft;

function startTimer(timer) {
  clearInterval(timerInterval);
  setTimeLeft(timer);
  timerInterval = setInterval(function() {
    timeLeft--;
    minutes = Math.floor(timeLeft / 60);
    seconds = timeLeft % 60;
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    $('#session').text(minutes + ':' + seconds);
    if (timeLeft == 0) { stopTimer(timer); }
  }, 1000);
}

var sounds = {
  session: new Audio("sounds/sessionEnd.ogg"),
  break: new Audio("sounds/breakEnd.ogg")
};
var flowStates = { session: 'break', break: 'session' }

function stopTimer(timer, no_sound) {
  no_sound = !!no_sound

  clearInterval(timerInterval);
  if (!no_sound) { sounds[timer].play(); }
  $('#session').text('00:00');
  if (runningFlow) { startTimer(flowStates[timer]); }
}

function setTimeLeft(timer) {
  timerVal = $('input[name="'+timer+'"]').val()
  if (timerVal.match(':')) {
    _timerVal = timerVal.split(':')
    timeLeft = _timerVal[0] * 60 + _timerVal[1];
  } else {
    timeLeft = timerVal * 60
  }
}

var defaultDurations = { session: 25, break: 5 };

function timerDuration(timer) {
  if ($.cookie(timer + '-duration')) {
    return $.cookie(timer + '-duration')
  } else {
    return defaultDurations[timer];
  }
}
