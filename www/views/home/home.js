'Use Strict';
angular.module('App').controller('homeController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils,Phased) {
  var ref = new Firebase(FURL);

  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  }

  // PhasedProvider integrations
  // n.b.: categories now in Phased.team.categorySelect and in Phased.team.categoryObj (different structures)
  // n.b.: Phased.user.profile is a link to Phased.team.members[Auth.user.uid].profile;
  $scope.team = Phased.team;
  $scope.currentUser = Phased.user.profile;
  $scope.assignments = Phased.assignments;
  //$scope.archive = Phased.archive;
  console.log($scope.team);

  // ensure view updates when new members are added
  // members data retrieved
  $scope.$on('Phased:membersComplete', function() {
    $scope.$apply();
  });

  // history retrieved
  $scope.$on('Phased:historyComplete', function() {
    $scope.$apply();
    console.log(Phased);
  });

}
);
