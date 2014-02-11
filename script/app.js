var App = (function() {
  var currentParty;

  function init(options) {
    var elForm = $('#inits form');

    Escalation.init({
      'el': $('#cube'),
      'onUpdate': Battle.save
    });

    Inits.init({
      'elList': $('#inits ol'),
      'elName': $('#init-name'),
      'elValue': $('#init-value'),
      'onInitChange': Battle.save
    });

    Battle.init({
      'elLink': $('#battle-link'),
      'parse': options.parse,
      'onReset': onBattleReset
    });

    Parties.init({
      'onSelect': onPartySelected
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

    $('#button-reset').addEventListener('click', reset);
    $('#button-party-load').addEventListener('click', Parties.toggle);
    $('#button-party-save').addEventListener('click', createParty);

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
        reset();
      }
    } else if (keyCode === 32 || keyCode === 38) {
      Escalation.inc();
    } else if (keyCode === 40) {
      Escalation.dec();
    }
  }

  function onPartySelected(name, players) {
    currentParty = {
      'name': name,
      'players': players
    };

    loadPartyPlayers();
  }

  function reset() {
    Battle.reset();
  }

  function onBattleReset() {
    loadPartyPlayers();
  }

  function loadPartyPlayers() {
    if (currentParty) {
      var players = currentParty.players;
      for (var i = 0, player; player = players[i++];) {
        Inits.addPlayer(player);
      }
    }
  }

  function createParty() {
    var playersInits = Inits.get(),
        players = [],
        name = '';

    for (var i = 0, player; player = playersInits[i++];) {
      players.push(player.name);
    }

    if (players.length === 0) {
      return;
    }

    name = prompt('Please enter the name of the party (' + players.join(', ') + '):');

    if (!name) {
      return;
    }

    Parties.add(name, players);

    alert('Party "' + name + '" saved!');

    currentParty = {
      'name': name,
      'players': players
    };
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

var Parties = (function() {
  var el,
      elList,

      onSelect,

      parties = {};

  function init(options) {
    onSelect = options.onSelect || function() {};

    createUI();
    load();
  }

  function load() {
    Storage.get('parties', function(partiesFromCache) {
      !partiesFromCache && (partiesFromCache = {});

      for (var name in partiesFromCache) {
        printParty(name, partiesFromCache[name]);
      }
    });
  }

  function save() {
    Storage.set('parties', parties);
  }

  function add(name, players) {
    printParty(name, players);
    save();
  }

  function printParty(name, players) {
    var elParty = document.createElement('li');

    elParty.dataset.name = name;

    elParty.innerHTML = '<b>' + name + '</b>: ' + players.join(', ');

    elParty.addEventListener('click', onPartyClick);
  
    elList.appendChild(elParty);

    parties[name] = players;
  }

  function onPartyClick(e) {
    var elParty = this,
        name = elParty.dataset.name,
        players = parties[name];

    var elCurrent = elList.querySelector('active');
    if (elCurrent) {
      elCurrent.classList.remove('active');
    }
    elParty.classList.add('active');

    hide();

    onSelect(name, players);
  }

  function getParty(name) {
    return parties[name];
  }

  function show() {
    document.body.classList.add('parties-show');
  }

  function hide() {
    document.body.classList.remove('parties-show');
  }

  function toggle() {
    document.body.classList.toggle('parties-show');
  }

  function createUI() {
    el = document.createElement('div');
    el.id = 'parties';

    el.innerHTML = '<h2>Parties</h2><ul></ul>';
    elList = el.querySelector('ul');

    document.body.appendChild(el);
  }

  return {
    'init': init,
    'show': show,
    'hide': hide,
    'toggle': toggle,
    'add': add,
    'getParty': getParty
  };
}());

var Storage = (function() {

  function set(key, value) {
    value = {
      'value': value
    };

    localStorage[key] = JSON.stringify(value);
  }

  function get(key, callback) {
    var value = localStorage[key];

    if (value) {
      try {
        value = JSON.parse(value);
      } catch(ex) {

      }
    }

    callback((value || {}).value);
  }

  return {
    'get': get,
    'set': set
  };
}());