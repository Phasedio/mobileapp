'Use Strict';

angular.module('App').controller('SubProjectsController', function ($scope, $state) {
  console.log('In subProjects');
  $scope.taskAmount = 10;
  $scope.completedAmount = 3;
  $scope.progressPercent = ($scope.completedAmount/$scope.taskAmount) * 100;

  $scope.projectDetail = function(){
    console.log('will go to the project detail page');
    $state.go('menu.tab.projectDetail');
  }


});
