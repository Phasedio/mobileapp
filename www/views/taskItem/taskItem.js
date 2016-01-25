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
     return filtered;
   };
 })/**
   * filters tasks by status
   *
   * (preface statusID with ! to filter out statuses)
   */
   .filter('filterTaskByStatus', function() {
     return function(input, statusID) {
       if (!input) return input;
       if (!statusID) return input;
       var expected = ('' + statusID).toLowerCase(); // compare lowercase strings
       var result = {}; // output obj

       if (expected[0] === '!') {
         expected = expected.slice(1); // remove leading !
         // negative filter -- filter out tasks with status
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.status).toLowerCase(); // current task's status
           if (actual !== expected) {
             result[key] = value; // preserves index
           }
         });
       } else {
         // only include tasks with status
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.status).toLowerCase(); // current task's status
           if (actual === expected) {
             result[key] = value; // preserves index
           }
         });
       }

       return result;
     }
   })
   /**
   * filters tasks by category
   *
   * (preface statusID with ! to filter out statuses)
   */
   .filter('filterTaskByCategory', function() {
     return function(input, catID) {
       if (!input) return input;
       if (!catID) return input;
       var expected = ('' + catID).toLowerCase(); // compare lowercase strings
       var result = {}; // output obj

       if (expected[0] === '!') {
         expected = expected.slice(1); // remove leading !
         // negative filter -- filter out tasks with cat
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.cat).toLowerCase(); // current task's cat
           if (actual !== expected) {
             result[key] = value; // preserves index
           }
         });
       } else {
         // only include tasks with cat
         angular.forEach(input, function(value, key) {
           var actual = ('' + value.cat).toLowerCase(); // current task's cat
           if (actual === expected) {
             result[key] = value; // preserves index
           }
         });
       }

       return result;
     }
   });

angular.module('App').controller('TasksIDController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils,Phased,$stateParams) {
  console.log('HEY IM HERE CAN YOU SEE ME!!!!!!');



  $scope.archive = Phased.archive;
  $scope.viewType = Phased.viewType;
    $scope.taskPriorities = Phased.TASK_PRIORITIES; // in new task modal
    $scope.taskStatuses = Phased.TASK_STATUSES; // in new task modal
    $scope.taskPriorityID = Phased.TASK_PRIORITY_ID;
    $scope.taskStatusID = Phased.TASK_STATUS_ID;
    $scope.myID = Auth.user.uid;
  $scope.activeStream = Phased.assignments.to_me;
  $scope.activeStreamName = 'assignments.to_me';
  $scope.activeStatusFilter = '!1'; // not completed tasks
  $scope.filterView = $scope.activeStreamName;//for the select filter


  $scope.task = Phased.assignments.all[$stateParams.taskid];
  console.log($scope.task);

  console.log($scope.taskPriorityID);

  $scope.currentUser = Auth.user.profile.gravatar;


  //if ($scope.task.deadline == nil) {
  //  $scope.task.due = 'No Date Set';
  //
  //} else {
    var myDate = new Date($scope.task.deadline);
    $scope.task.due = myDate.toDateString();
  //}


  if ($scope.task.priority==2){
    $scope.priority = "Low";
  } else if ($scope.task.priority==1){
    $scope.priority = "Medium";
  } else {
    $scope.priority = "High";
  }

  $scope.taskStart = function(){
    console.log('will set the progress going');
  }
});
