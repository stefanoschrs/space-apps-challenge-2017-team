(function () {
  'use strict'

  angular
    .module('SpaceApps')
    .controller('MapController', MapController)

  MapController.$inject = ['$log', 'NgMap', 'SocketFactory']

  function MapController ($log, NgMap, SocketFactory) {
    const vm = this
    let socket

    vm.shelterMarkers = []
    vm.fireMarkers = []

    NgMap
      .getMap()
      .then(function(map) {
        $log.debug('Map ready!')
        vm.map = map

        socketConnect()
      })

    function socketConnect () {
      socket = SocketFactory.get()

      if (!socket) return setTimeout(socketConnect, 250)

      socket.emit('map-ready')

      socket.on('locations:shelter', (data) => {
        $log.debug('soc:locations:shelter', data)
        _addLocations('shelter', data)
        _removeLocations('shelter', data)
      })

      socket.on('locations:fire', (data) => {
        $log.debug('soc:locations:fire', data)
        _addLocations('fire', data)
        _removeLocations('fire', data)
      })

      socket.on('locations:landslide', (data) => {
        $log.debug('soc:locations:landslide', data)
        _addLocations('landslide', data)
        _removeLocations('landslide', data)
      })

      socket.on('locations:flood', (data) => {
        $log.debug('soc:locations:flood', data)
        _addLocations('flood', data)
        _removeLocations('flood', data)
      })
    }

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

    function _removeLocations (type, locations) {
      for (let i = vm[type + 'Markers'].length - 1; i >= 0; i--) {
        let marker = vm[type + 'Markers'][i]

        if (locations.find((location) => location.data.id === marker.data.id)) {
          return
        }
        $log.debug('Removing marker')

        marker.setMap(null)
        vm[type + 'Markers'].splice(i, 1)
      }
    }
  }
})()
