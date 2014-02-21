angular.module('SongVis.directives').directive('playlist', ["AudioPlayer", function(AudioPlayer) {
  return {
    scope: {
      songs: '=',
      array: '='
    },
    restrict: 'E',
    templateUrl: 'templates/playlist.html',
    link: function(scope, element, attrs) {
      scope.audio = new Audio();

      var audioPlayer = new AudioPlayer();
      audioPlayer.setupAudioNodes();
      scope.context = audioPlayer.audioContext;
      scope.analyser = audioPlayer.analyser;
      scope.javascriptNode = audioPlayer.javascriptNode;

      var source = scope.context.createMediaElementSource(scope.audio);
      source.connect(scope.analyser);
      scope.analyser.connect(scope.context.destination);

      scope.remove = function(index) {
        scope.songs.splice(index, 1);
        scope.audio.pause();
      };

      scope.pause = function() {
        scope.audio.pause();
      }

      scope.playing = function() {
        return !scope.audio.paused
      };

      scope.play = function(url) {
        if (url === scope.audio.src.replace(location.origin+"/","")) {
          scope.audio.play();
          return;
        }
        scope.audio.src = url;

        scope.audio.autoplay = true;
        scope.javascriptNode.onaudioprocess = function() {
          scope.$apply(function() {
            scope.array = new Uint8Array(scope.analyser.frequencyBinCount);
            scope.analyser.getByteFrequencyData(scope.array);
          });
        };

      };

    }
  };
}]);