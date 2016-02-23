'Use Strict';
angular.module('App').controller('historyController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$ionicModal, $ionicSideMenuDelegate, $firebaseObject, Auth, FURL, Utils,Phased, $stateParams) {
  var ref = new Firebase(FURL);
  $scope.status = Phased.team.statuses;
  console.log('the status is ', $scope.status)
  //console.log($stateParams, $stateParams.userid)
  $scope.userid = $stateParams.userid;
  console.log($scope.userid);

  $scope.history = Phased.team.statuses;
  //$scope.history1 = Phased.team.statuses[$stateParams.userid]
  //console.log('the history is', $scope.history, $scope.history1)

  //angular.forEach($scope.team.statuses, function(key, value){
  //  console.log('the key is:', key, 'and the value is:', value);
  //
  //})
})
