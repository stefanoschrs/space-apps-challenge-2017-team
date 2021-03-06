(function () {
  'use strict'

  angular
    .module('SpaceApps')
    .controller('ReportController', ReportController)

  ReportController.$inject = ['$log', '$http', 'NgMap', 'API']

  function ReportController ($log, $http, NgMap, API) {
    const vm = this

    let marker

    vm.types = ['shelter', 'fire']
    vm.incident = {
      type: '',
      lat: 0,
      lng: 0,
      data: {
        name: ''
      }
    }

    vm.reportIncident = reportIncident
    vm.isIncident = isIncident
    vm.onDragEnd = onDragEnd

    NgMap
      .getMap()
      .then(function(map) {
        $log.debug('Map ready!')
        vm.map = map

        marker = new google.maps.Marker({ position: new google.maps.LatLng(34.999481, 32.9986789) })
      })

    function reportIncident () {
      $http
        .post(API + '/api/report', vm.incident)
        .then($log.debug)
        .catch($log.error)
    }

    function isIncident () {
      return vm.incident.type
        && vm.incident.lat
        && vm.incident.lng
        && vm.incident.data.name
    }

    function onDragEnd ($ev) {
      vm.incident.lat = $ev.latLng.lat()
      vm.incident.lng = $ev.latLng.lng()
    }
  }
})()
