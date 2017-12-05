const Object = require ('../object');
const assert = require ('assert');
const ListenerHandle = require ('./listener-handle');
const async = require ('async');

/**
 * Wrapper class for a set of listeners for an event.
 */
let EventListeners = Object.extend ({
  init () {
    this._super.call (this, ...arguments);

    assert (this.name, 'The EventListeners object must be initialized with a name');

    this._on = [];
    this._once = [];
  },

  /**
   * Register a new listener for the event.
   *
   * @param listener
   */
  on (listener) {
    let index = this._on.push (listener) - 1;
    return new ListenerHandle ({listeners: this, index});
  },

  /**
   * Register a listener that is only called once. Once the listener is executed,
   * it will be removed from the registry.
   *
   * @param listener
   */
  once (listener) {
    this._once.push (listener);
  },

  /**
   * Emit a new event.
   */
  emit () {
    let args = arguments;

    let once = this._once;
    this._once = [];

    return new Promise ((resolve, reject) => {
      async.parallel ([
        function (callback) {
          async.each (this._on, (listener) => { listener.event.apply (listener, args); }, callback);
        },

        function (callback) {
          async.each (once, (listener) => { listener.event.apply (listener, args); }, callback);
        }
      ], done);

      function done (err) {
        if (err) return reject (err);
        return resolve (null);
      }
    });
  },

  /**
   * Remove the listener at the specified index.
   *
   * @param index
   */
  removeListenerAt (index) {
    this._on.splice (index, 1);
  }
});

module.exports = EventListeners;
