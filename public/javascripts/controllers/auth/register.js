{
  /* global angular */
  angular
    .module('appControllers')
    .controller('registerCtrl', registerCtrl)

  registerCtrl.$inject = ['$scope', '$state', 'authService'];

  function registerCtrl($scope, $state, authService) {

    $scope.registerUser = function(user) {
      authService.api().register(user, function(user) {
        $state.transitionTo('home', user);
      })
    }

  }

}
