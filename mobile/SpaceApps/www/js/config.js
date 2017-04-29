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

    sp.state('app.shelters', {
      url: '/shelters',
      views: {
        'menuContent': {
          templateUrl: 'templates/shelters.html',
          controller: 'SheltersController',
          controllerAs: 'sheltersCtrl'
        }
      }
    })

    sp.state('app.report', {
      url: '/report',
      views: {
        'menuContent': {
          templateUrl: 'templates/report.html',
          controller: 'ReportController',
          controllerAs: 'reportCtrl'
        }
      }
    })

    $urlRouterProvider.otherwise('/app/map');
  }
})()
