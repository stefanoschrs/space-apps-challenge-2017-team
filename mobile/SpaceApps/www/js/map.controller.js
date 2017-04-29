(function () {
  'use strict'

  angular
    .module('SpaceApps')
    .controller('MapController', MapController)

  MapController.$inject = ['$log', 'NgMap', 'SocketFactory']

  function MapController ($log, NgMap, SocketFactory) {
    const vm = this
    const socket = SocketFactory.get()

    vm.shelterMarkers = []
    vm.fireMarkers = []

    socket.on('locations:shelters', (data) => {
      $log.debug('soc:locations:shelters', data)
      _addLocations('shelter', data)
    })
    socket.on('locations:fire', (data) => {
      $log.debug('soc:locations:fire', data)
      _addLocations('fire', data)
    })

    NgMap
      .getMap()
      .then(function(map) {
        $log.debug('Map ready!')
        vm.map = map

        socket.emit('map-ready')
      })

    function _addLocations (type, locations) {
      locations.forEach((location) => {
        const markers = vm[type + 'Markers']

        const marker = markers.find((m) => m.data.id === location.data.id)
        if (marker) {
          $log.debug(`Updating ${type} marker`)
          marker.data = location.data
          return
        }

        $log.debug(`Adding ${type} marker`)
        let latLng = new google.maps.LatLng(location.lat, location.lng)
        markers.push(new google.maps.Marker({
          position: latLng,
          animation: google.maps.Animation.DROP,
          icon: {
            url: `img/icons/${type}.png`,
            size: new google.maps.Size(60, 60),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 15),
            scaledSize: new google.maps.Size(30, 30)
          },
          data: location.data
        }))
        vm.markerClusterer = new MarkerClusterer(vm.map, markers, {})
      })
    }
  }
})()
