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
  $scope.histories = $firebaseArray(ref.child('team').child(Phased.team.uid).child('statuses').orderByChild("user").equalTo($scope.selectedTeamMember).limitToLast(50));

})
