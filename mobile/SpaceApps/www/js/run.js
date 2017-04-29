(function () {
  angular
    .module('SpaceApps')
    .run(run)

  run.$inject = ['$ionicPlatform', 'SocketFactory']

  function run($ionicPlatform, SocketFactory) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        cordova.plugins.Keyboard.disableScroll(true)

      }
      if (window.StatusBar) {
        StatusBar.styleDefault()
      }

      SocketFactory.init()
    })
  }
})()
