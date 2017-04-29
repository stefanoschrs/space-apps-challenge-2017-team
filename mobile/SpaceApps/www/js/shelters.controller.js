(function () {
  'use strict'

  angular
    .module('SpaceApps')
    .controller('SheltersController', SheltersController)

  SheltersController.$inject = ['$scope', '$http', '$log', '$cordovaGeolocation', 'API']

  function SheltersController ($scope, $http, $log, $cordovaGeolocation, API) {
    const vm = this

    vm.selectedShelter = ''
    vm.shelters = []

    vm.selectShelter = selectShelter
    vm.findNearestShelter = findNearestShelter

    $scope.$on('$ionicView.afterEnter', onIonicViewAfterEnter)

    function onIonicViewAfterEnter () {
      $http
        .get(`${API}/api/shelters`)
        .then((res) => {
          vm.shelters = res.data.shelters
        })
        .catch($log.error)
    }

    function findNearestShelter () {
      $cordovaGeolocation
        .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
        .then((position) => {
          $log.debug(position)
        }, $log.error);
    }

    function selectShelter (value) {
      $log.debug(value)
    }
  }
})()
