(function () {
  angular
    .module('SpaceApps')
    .factory('SocketFactory', SocketFactory)

  SocketFactory.$inject = ['$log', 'API']

  function SocketFactory ($log, API) {
    let _socket

    function init () {
      _socket = io.connect(API)

      _socket.on('connect', () => $log.debug('Socket Connected'))
      _socket.on('error', (data) => $log.debug('Socket Error', data))
      _socket.on('connect_failed', (data) => $log.debug('Socket Error', data))
    }

    function get () {
      return _socket
    }

    return { init, get }
  }
})()
