angular.module("SongVis.controllers").controller("SongCtrl", ["$scope",
                                                 "$http", "$document",
                                                 "SortService",
                                                 "SocketService",
                                                 "AudioPlayer",
                                                 "Soundcloud",
                                                 function($scope, $http,
                                                          $document,
                                                          SortService,
                                                          SocketService,
                                                          AudioPlayer,
                                                          Soundcloud) {
  $document.on('keydown', ".js-search-form", function(ev) {
    if (ev.keyCode === 13) { // Enter keycode
      $scope.searchServers();
    }
  });

  var SC = new Soundcloud({
    client_id: "1182e08b0415d770cfb0219e80c839e8",
    format: "json",
    "_status_code_map[302]": 200
  })
  $scope.songs = [];
  $scope.servers = [];
  $scope.showTab = 'search';
  $scope.audioPlayer = AudioPlayer;

  $scope.queue = function(song) {
    AudioPlayer.songs.push(song)
    SocketService.send(AudioPlayer.songs);
  };

  $scope.toggleTab = function(tab) {
    $scope.showTab = tab;
  };

  $scope.activeTab = function(tab) {
    return $scope.showTab === tab;
  };

  $scope.sortService = new SortService(['+artist', 'album', 'track']);

  $scope.variableWidth = function() {
    var css = {}
    if (AudioPlayer.songs.length) {
      css = {width: "75%"};
    }
    return css;
  };

  $scope.addServer = function(url) {
    // add check for http://
    $scope.servers.push("http://" + url);
  };

  $scope.removeServer = function(index) {
    $scope.servers.splice(index, 1);
  };

  $scope.searchServers = function() {
    $scope.songs = [];
    SC.search($scope.searchText).appendSongs($scope.songs);

    $scope.servers.forEach(function(server) {
      $http.get(server + "/search", {params: {search: $scope.searchText}})
      .then(processServerResponse)
    })
  };

  function processServerResponse(payload) {
    var songs = payload.data;
    $scope.songs.push.apply($scope.songs, songs);
  }
}]);
