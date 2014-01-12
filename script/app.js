var App = (function() {
  function init(options) {
    var elForm = $('#inits form');

    Escalation.init({
      'el': $('#cube'),
      'onUpdate': Battle.save
    });
    Inits.init({
      'elList': $('#inits ol'),
      'elName': $('#init-name'),
      'elValue': $('#init-value')
    });

    Battle.init({
      'elLink': $('#battle-link'),
      'parse': options.parse
    });

    elForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addInitPlayer();
    });
    elForm.addEventListener('keydown', function(e) {
      e.stopPropagation();

      if (e.keyCode === 13) {
        addInitPlayer();
      }
    });
    $('#init-value').addEventListener('keydown', function(e) {
      if (e.keyCode === 9 && !e.shiftKey) {
        e.preventDefault();
        addInitPlayer();
      }
    });

    $('#join-battle').addEventListener('click', Battle.get);
    $('#die-minus').addEventListener('click', Escalation.dec);
    $('#die-plus').addEventListener('click', Escalation.inc);

    window.addEventListener('keydown', onKeyPress);

    $('#init-name').focus();
  }

  function addInitPlayer() {
    Inits.addPlayerFromInputs();
    Battle.save();
  }

  function onKeyPress(e) {
    if (Battle.isReadOnly()) {
      return;
    }

    var keyCode = e.keyCode;

    if (keyCode === 27) {
      if (confirm('Are you SURE you want to end the battle and reset everything?')) {
        Battle.reset();
      }
    } else if (keyCode === 32 || keyCode === 38) {
      Escalation.inc();
    } else if (keyCode === 40) {
      Escalation.dec();
    }
  }

  function $(s) {
    return document.querySelector(s);
  }
  function $$(s) {
    return document.querySelectorAll(s);
  }

  return {
    init: init
  };
}());