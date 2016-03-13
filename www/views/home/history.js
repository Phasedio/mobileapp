'Use Strict';

/**
 *
 * allows ordering an object as if it were an array,
 * at the cost of being able to access its original index
 * Adds a property 'key' with the original index to
 * address this
 *
 */
angular.module('App').filter('orderObjectBy', function() {
  console.log('we are in the filter');
  return function(items, field, reverse) {
    var filtered = [];
    for (var i in items) {
      items[i].key = i;
      filtered.push(items[i]);
    }
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    console.log('the fitered', filtered);
    return filtered;
  };
});

angular.module('App').controller('historyController', function ($scope, $filter, $state, $localStorage, $location,$http,$ionicPopup,$ionicModal, $ionicSideMenuDelegate, $firebaseArray, $firebaseObject, Auth, FURL, Utils,Phased, $stateParams) {
  var ref = new Firebase(FURL);

  $scope.selectedTeamMember = $stateParams.userid;
  $scope.selectedTeamMemberInfo = Phased.team.members[$scope.selectedTeamMember];

  console.log('the selected Team member infor', $scope.selectedTeamMember, $scope.selectedTeamMemberInfo);
  $scope.currentUser = Phased.user;
  console.log($scope.currentUser);

  console.log('phased team is', Phased.team)
  //$scope.currentStatus = Phased.team

  //need to call to firebase for the history. Phased team statuses only holds the last 100 statusesV
  $scope.history = $firebaseArray(ref.child('team').child(Phased.team.uid).child('statuses'));
  console.log('the histories are', $scope.history);
  //console.log('the histories are', $scope.history[4]);

  //for (var i = 0; i < 5; i++) {
  //  console.log('i is', $scope.history[i]);
  //}
  //
  //angular.forEach($scope.history, function(value,key ) {
  //  console.log(value,key)
  //
  //});

  $scope.histories = $scope.history;
  //
  //$scope.histories = Phased.team.statuses;
  //console.log('the history', $scope.histories);



})
