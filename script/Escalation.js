var Escalation = (function() {
  var value = 0,
      el,

      onUpdate,

      MIN = 0,
      MAX = 6;

  function init(options) {
    el = options.el;
    MIN = options.min || MIN;
    MAX = options.max || MAX;

    onUpdate = options.onUpdate || function(){};
  }

  function get() {
    return value;
  }

  function set(newValue) {
    value = newValue * 1;
    update();
  }

  function reset() {
    value = MIN;
    update();
  }

  function max() {
    value = MAX;
    update();
  }

  function inc() {
    value++;
    update();
  }

  function dec() {
    value--;
    update();
  }

  function update() {
    value = Math.min(Math.max(value, MIN), MAX);

    if (value) {
      el.className = 'value c' + value;
    } else {
      el.removeAttribute('class');
    }

    onUpdate();
  }

  return {
    init: init,
    inc: inc,
    dec: dec,
    get: get,
    set: set,
    reset: reset,
    max: max
  };
}());