(function () {
  'use strict'

  angular
    .module('SpaceApps')
    .controller('LoginController', LoginController)

  LoginController.$inject = ['$log']

  function LoginController ($log) {
    const vm = this

    vm.login = login

    function login () {
      vm.loginActive = true
    }
  }
})()
