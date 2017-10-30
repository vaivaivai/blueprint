const Listener = require ('./listener')
  , assert     = require ('assert')
  ;

/**
 * @class LegacyListener
 *
 * Adapter for porting legacy listener function to Listener objects. The LegacyListener
 * object is provided for backwards compatibility support.
 *
 * The constructor takes a single function, which is mapped to the doEvent() method
 * on the Listener class.
 *
 * This object is used internally by the Blueprint framework.
 */
const LegacyListener = Listener.extend ({
  init (listener) {
    assert (typeof listener === 'function');
    this._super.init.apply (this, arguments);
    this._listener = listener;
  },

  doEvent () {
    this._listener (...arguments);
  }
});

module.exports = LegacyListener;