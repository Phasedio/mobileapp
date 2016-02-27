'Use Strict';


angular.module('App').controller('historyController', function ($scope, $filter, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$ionicModal, $ionicSideMenuDelegate, $firebaseObject, Auth, FURL, Utils,Phased, $stateParams) {
  var ref = new Firebase(FURL);

  $scope.selectedTeamMember = $stateParams.userid;
  $scope.selectedTeamMemberInfo = Phased.team.members[$scope.selectedTeamMember];

  console.log($scope.selectedTeamMember, $scope.selectedTeamMemberInfo);
  $scope.currentUser = Phased.user;
  console.log($scope.currentUser);


  $scope.histories = Phased.team.statuses;
  console.log('the history', $scope.histories);



})
