var Inits = (function() {
  var elList,
      elName ,
      elValue,

      players = [];

  function init(options) {
    elList = options.elList;
    elName = options.elName;
    elValue = options.elValue;
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
    init = init * 1;

    var el = document.createElement('li');

    if (init * 1 != init) {
      init = 0;
    }

    if (!name && !init) {
      elName.blur();
      elValue.blur();
      return;
    }

    el.dataset.init = init;
    el.dataset.name = name;
    el.innerHTML = '<span>' + name + '</span> <b>' + init + '</b>';

    elList.appendChild(el);

    elValue.value = '';
    elName.value = '';

    elName.focus();
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