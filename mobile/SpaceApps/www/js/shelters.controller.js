(function () {
  'use strict'

  angular
    .module('SpaceApps')
    .controller('SheltersController', SheltersController)

  SheltersController.$inject = ['$scope', '$http', '$log', '$ionicModal', '$cordovaGeolocation', 'API']

  function SheltersController ($scope, $http, $log, $ionicModal, $cordovaGeolocation, API) {
    const vm = this

    vm.selectedShelter = ''
    vm.shelters = []

    vm.selectShelter = selectShelter
    vm.findNearestShelter = findNearestShelter

    $ionicModal
      .fromTemplateUrl('templates/shelter.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then((modal) => {
        vm.modal = modal
      })

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

          let minDistance = Number.MAX_VALUE
          let nearestShelterIndex = -1

          vm.shelters.forEach((shelter, index) => {
            let euklidian = Math.sqrt(Math.pow(
                (position.coords.latitude - shelter.lng),2)
              + Math.pow(
                (position.coords.longitude - shelter.lng),2))

            if (minDistance > euklidian) {
              minDistance = euklidian
              nearestShelterIndex = index
            }
          })

          selectShelter(vm.shelters[nearestShelterIndex])
        }, $log.error);
    }

    function selectShelter (value) {
      vm.selectedShelter = value
      $log.debug(value)
      vm.modal.show()
    }
  }
})()
