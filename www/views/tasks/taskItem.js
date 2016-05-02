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

angular.module('App').controller('taskItemController', function ($scope, $state, $rootScope, $ionicPopup, $cordovaDatePicker, $firebaseArray, $localStorage, $location, $http, $ionicModal, $firebaseObject, Auth, FURL, Utils,Phased, $cordovaCamera, $stateParams) {

  var ref = new Firebase(FURL);
  var taskid = $stateParams.taskid;
  $scope.idTask= taskid;
  //console.log($scope.taskid);
  $scope.user = Phased.user;
  $scope.task = Phased.team.projects['0A'].columns['0A'].cards['0A'].tasks[taskid];
  $scope.edit = {};
  if ($scope.task.status == 0) {
    $scope.task.statusName = "In Progress";
    $scope.toggleState = false;
  } else if($scope.task.status == 2){
    $scope.task.statusName = "Assigned";
    $scope.toggleState = true;
  }
  //Dealing with the toggling between start and stop
  $scope.toggleText = $scope.toggleState ? 'Start' : 'Stop';
  $scope.toggleClass = $scope.toggleState ? 'button-balanced' : 'button-dark';
 
  $scope.toggle = function (taskid, task) {
    $scope.toggleState = !$scope.toggleState;
    $scope.toggleText = $scope.toggleState ? 'Start' : 'Stop';

    console.log('we clicked toggle', $scope.toggleState);
    if ($scope.toggleState) {
      $scope.task.statusName = "Assigned";
      $scope.toggleClass = 'button-balanced';
      console.log('pausing the task', taskid, task);
      Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.ASSIGNED)
    } else {
      console.log('we will run the Stat task', taskid, task);
      $scope.task.statusName = "In Progress";
      $scope.toggleClass = 'button-dark';
      Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.IN_PROGRESS);
    }
  }
  
  if ($scope.task.deadline) {
    var myDate = new Date($scope.task.deadline);
  
    $scope.task.due = myDate.toDateString();
  }else{
    var myDate = new Date();
    $scope.task.due = myDate.toDateString();
  }
  

 
 
  // //find the category
  $scope.task.categories = Phased.team.categoryObj;
  $scope.task.category = Phased.team.categoryObj[$scope.task.cat];
  

  $ionicModal.fromTemplateUrl('views/tasks/edit-task-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
  
  $scope.taskEdit = function(taskid, task) {
    $scope.modal.show();
   
    angular.copy($scope.task, $scope.edit);
    

  };

  // //sets up for reassigning members
  $scope.team = rtnTeamArry();
  // var id = Phased.user.uid;
  $scope.taskMembersSelected = {uid: Phased.user.uid, name: Phased.team.members[Phased.user.uid].name};
  $scope.save = function(edit){
    
    console.log(edit);
    console.log($scope.task);
    //check title
    if (edit.name != $scope.task.name) {
      Phased.setTaskName(taskid, edit.name);
      console.log("need to change name");
    }
    //check description
    if (edit.description != $scope.task.description) {
      Phased.setTaskDesc(taskid, edit.description);
      console.log("need to change descritp");
    }
    
    //check date
    if (edit.due != $scope.task.due) {
      Phased.setTaskDeadline(taskid, edit.due );
      console.log("need to change date");
    }
    
    // //check status
    // if (edit.status != $scope.task.status) {
    //   console.log("need to change status");
    // }
    
    // //check assignment to
    // if (edit.assigned_to.key != $scope.task.assigned_to) {
    //   console.log("need to change user");
    //   Phased.setTaskAssignee(taskid, edit.assigned_to.key);
    // }
    // //check priority
    // if (edit.priority != $scope.task.priority) {
    //   console.log("need to change priority");
    //   Phased.setTaskPriority(taskid, edit.priority);
    // }
    
    // //check category
    $scope.closeModal();
    
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.taskFinish = function(taskid, task){
    console.log('we will complete task', taskid, task);
    Phased.setTaskStatus(taskid, Phased.task.STATUS_ID.COMPLETE);
    $state.go('menu.tab.tasks');
  }

  // $scope.$on('modal.hidden', function() {
  // });

  // $scope.$on('Phased:membersComplete', function() {
  //   $scope.$apply();
  // });

  // // history retrieved
  // $scope.$on('Phased:historyComplete', function() {
  //   $scope.$apply();
  //   //console.log(Phased);
  // });

  // $scope.$watch('Phased.assignments', function(user){
  //   $scope.assignments = Phased.assignments;
  //   console.log('we are watching assingments', $scope.assignments);

  // });

  function rtnTeamArry(){
    var key = Object.keys(Phased.team.members);
    var arr = [];
    for (var i = 0; i < key.length; i++) {
      arr.push(Phased.team.members[key[i]]);
    }
    return arr;
  }
});
