var Battle = (function(){
  var object,
      timeoutUpdateBattle,

      elLink,

      ParseBattle,

      IS_READ_ONLY = false,

      UPDATE_INTERVAL = 500,
      PARSE_APP_ID,
      PARSE_KEY;

  function init(options) {
    PARSE_APP_ID = options.parse.appId;
    PARSE_KEY = options.parse.key;

    Parse.initialize(PARSE_APP_ID, PARSE_KEY);
    ParseBattle = Parse.Object.extend('Battle');

    elLink = options.elLink;

    var idFromURL = window.location.hash.replace('#', '');
    if (idFromURL) {
      get(idFromURL);
    }
  }

  function isReadOnly() {
    return IS_READ_ONLY;
  }

  function get(id) {
    var query = new Parse.Query(ParseBattle),
        callbacks = {
          'success': onBattleGotSuccess,
          'error': onBattleGotError
        };

    query.limit(1);
    query.descending('updatedAt');

    if (typeof id === 'string') {
      query.get(id.trim(), callbacks);
    } else {
      query.find(callbacks);
    }
  }

  function save() {
    if (IS_READ_ONLY) {
      return;
    }

    if (!object) {
      object = new ParseBattle();
    }

    object.save({
      'escalation': Escalation.get(),
      'players': Inits.get()
    }).then(function() {
      setLink();
    });
  }

  function reset() {
    Escalation.reset();
    Inits.reset();
  }

  function render() {
    var data = object.attributes;

    Escalation.set(data.escalation);
    Inits.set(data.players);

    setLink();
  }

  function setLink() {
    elLink.href = '#' + object.id;
    elLink.className = 'visible';
  }

  function listen(battle) {
    IS_READ_ONLY = true;

    document.body.classList.add('read-only');

    object = battle;

    render();

    if (!timeoutUpdateBattle) {
      timeoutUpdateBattle = window.setTimeout(update, UPDATE_INTERVAL);
    }
  }

  function update() {
    if (!object) {
      return;
    }

    object.fetch({
      success: function(battle) {
        timeoutUpdateBattle = null;
        listen(battle);
      },
      error: function(myObject, error) {
        console.warn('error updating battle!', error);
      }
    });
  }

  function onBattleGotSuccess(battle) {
    if (battle instanceof Array) {
      battle = battle[0];
    }

    if (battle) {
      listen(battle);
    }
  }

  function onBattleGotError(error) {
    console.warn("Error: ", error);
  }

  return {
    init: init,
    save: save,
    get: get,
    reset: reset,
    isReadOnly: isReadOnly
  };
}());