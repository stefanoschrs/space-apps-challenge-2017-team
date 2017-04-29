(function () {
  angular
    .module('SpaceApps')
    .config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider']
  function config ($stateProvider, $urlRouterProvider) {
    const sp = $stateProvider

    sp.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    sp.state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        }
      }
    })

    sp.state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'MapController',
          controllerAs: 'mapCtrl'
        }
      }
    })

    $urlRouterProvider.otherwise('/app/home');
  }
})()
