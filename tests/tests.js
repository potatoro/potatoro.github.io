// in order to see the app running inside the QUnit runner
App.rootElement = '#ember-testing';

// Common test setup
App.setupForTesting();
App.injectTestHelpers();

// common QUnit module declaration
module("Integration tests", {
  setup: function() {
    // before each test, ensure the application is ready to run.
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    // reset the application state between each test
    App.reset();
  }
});

// QUnit test case
test("should show timer form", function() {
  visit("/");

  // helper waiting the application is idle before running the callback
  andThen(function() {
    equal(find("input[name='session']").val(), 25, "There is session time input");
    equal(find("input[name='break']").val(), 5, "There is break time input");
  });
});
