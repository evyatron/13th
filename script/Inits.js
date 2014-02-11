var Inits = (function() {
  var elList,
      elName ,
      elValue,

      onInitChange,

      players = [];

  function init(options) {
    elList = options.elList;
    elName = options.elName;
    elValue = options.elValue;

    onInitChange = options.onInitChange || function(){};
  }

  function get() {
    return players;
  }

  function set(newPlayers) {
    players = newPlayers.slice(0);
    render();
  }

  function reset() {
    players = [];
    elList.innerHTML = '';
  }

  function sort() {
    players.sort(function sorter(a, b) {
      return a.init * 1 < b.init * 1? 1 : 
              a.init * 1 > b.init * 1? -1 : 0;
    });
  }

  function render() {
    sort();

    elList.innerHTML = '';

    for (var i = 0, player; player = players[i++];) {
      renderPlayer(player.name, player.init);
    }
  }

  function addPlayerFromInputs() {
    addPlayer(elName.value, elValue.value * 1);
  }

  function addPlayer(name, init) {
    players.push({
      name: name,
      init: init
    });

    render();
  }

  function renderPlayer(name, init) {
    var el = document.createElement('li');

    if (init * 1 != init) {
      init = 0;
    }

    init *= 1;

    if (!name && !init) {
      elName.blur();
      elValue.blur();
      return;
    }

    el.dataset.init = init;
    el.dataset.name = name;
    el.innerHTML = '<span>' + name + '</span> <b>' + init + '</b>';

    el.addEventListener('click', onInitClick);

    elList.appendChild(el);

    elValue.value = '';
    elName.value = '';

    elName.focus();
  }

  function onInitClick(e) {
    if (document.body.classList.contains('read-only')) {
      return;
    }
    
    var elInit = this,
        name = elInit.dataset.name,
        init = elInit.dataset.init;

    var newInit = prompt('Please enter the new init for ' + name + ': ', init) || init;

    for (var i = 0, player; player = players[i++];) {
      if (player.name === name) {
        player.init = newInit;
      }
    }

    render();

    onInitChange();
  }

  return {
    init: init,
    get: get,
    set: set,
    reset: reset,
    render: render,
    addPlayerFromInputs: addPlayerFromInputs,
    addPlayer: addPlayer
  };
}());