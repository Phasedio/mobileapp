'Use Strict';


angular.module('App').controller('historyController', function ($scope, $filter, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$ionicModal, $ionicSideMenuDelegate, $firebaseObject, Auth, FURL, Utils,Phased, $stateParams) {
  var ref = new Firebase(FURL);



  $scope.userid = $stateParams.userid;
  console.log($scope.userid);
  $scope.currentUser = Phased.user;
  console.log($scope.currentUser);


  $scope.histories = Phased.team.statuses;
  console.log('the history', $scope.histories);

  angular.forEach($scope.histories, function(key, value){
    //console.log('the key is:', key, 'and the value is:', value);
    //var user = key.user;
    //console.log(user, $scope.userid);
    if (key.user == $scope.userid){
      //console.log('what is the user id', $scope.userid, key);
      $scope.history = key;
      console.log($scope.history)
    }


  })


})
