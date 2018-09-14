// dispatch.js
// Simple API for Event dispatching in Node
var EventEmitter = require('events');
var observer = new EventEmitter();

module.exports = {
  // Register listener for an event
  on: function(event, callback) {
    observer.on(event, callback);
  },
  // Emit an event
  emit: function(event, arg) {
    observer.emit(event, arg);
  }
}