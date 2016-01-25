'Use Strict';

angular.module('App').controller('SubProjectsController', function ($scope) {
  console.log('In subProjects');
  $scope.taskAmount = 10;
  $scope.completedAmount = 3;
  $scope.progressPercent = ($scope.completedAmount/$scope.taskAmount) * 100;

});
