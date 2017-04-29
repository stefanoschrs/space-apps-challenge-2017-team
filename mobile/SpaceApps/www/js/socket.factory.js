(function () {
  angular
    .module('SpaceApps')
    .factory('SocketFactory', SocketFactory)

  SocketFactory.$inject = ['$log']

  function SocketFactory ($log) {
    let _socket

    function init () {
      _socket = io.connect('http://10.230.23.146:5000')
      $log.debug('Socket Connected')
    }

    function get () {
      return _socket
    }

    return { init, get }
  }
})()
