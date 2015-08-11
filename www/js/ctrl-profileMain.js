app.controller('ProfileMainCtrl', function($scope,Auth,$state,FURL) {
  $scope.team = Auth.team;
  $scope.user = {};
  $scope.updates = [];
  $scope.stats = {};
  $scope.view ="posts";
  var ref = new Firebase(FURL);

  ref.child('profile').child(Auth.user.uid).once('value',function(data){
    data = data.val();
    $scope.user = data;
  });

  // get all updates from user
  ref.child('team').child(Auth.team).child('all').once('value',function(data){
    data = data.val();
    var allUpdates = []
    var allKeys = Object.keys(data);
    for(var i = 0; i < allKeys.length; i++){
      if(data[allKeys[i]].user == Auth.user.uid){
        if(data[allKeys[i]].photo){
          data[allKeys[i]].photo = "background:url('"+data[allKeys[i]].photo+"') no-repeat center center fixed; -webkit-background-size: cover;-moz-background-size: cover; -o-background-size: cover; background-size: cover";
        }
        allUpdates.push(data[allKeys[i]]);
      }
    }
    $scope.updates = allUpdates;
    $scope.$apply();
  });

  $scope.showPosts = function(){
    $scope.view ="posts";
  }

  $scope.makeStats = function(){
    $scope.view ="stats";
    var updates = $scope.updates;
    var city = {};
    var activeDay = [0,0,0,0,0,0,0];
    var total = updates.length;
    console.log(updates);

    for(var i = 0; i < updates.length;i++){
      var day = new Date(updates[i].time).getDay();
      activeDay[day]++;
      if(updates[i].city){
        if(city[updates[i].city]){
          city[updates[i].city]++;
        }else{
          city[updates[i].city] = 1;
        }

      }
    }
    var k = activeDay.indexOf(Math.max.apply(Math,activeDay ));
    console.log(activeDay);
    var bestDay = '';
    switch(k){
      case 0:
        bestDay = 'Sunday';
        break;
      case 1:
        bestDay = 'Monday';
        break;
      case 2:
        bestDay = 'Tuesday';
        break;
      case 3:
        bestDay = 'Wednesday';
        break;
      case 4:
        bestDay = 'Thursday';
        break;
      case 5:
        bestDay = 'Friday';
        break;
      case 6:
        bestDay = 'Saturday';
        break;
      default:
        bestDay = false;
    }
    console.log(bestDay);
    console.log(city);
    $scope.stats = {
      bestDay : bestDay,
      city : city
    }
    // This will return the index  of max value in arry var i = arr.indexOf(Math.max.apply(Math, arr));
  }

  $scope.seeStatus = function(id){
    console.log(id);
    id = angular.toJson(id);
    if(id == Auth.user.uid){
      //show users own profile!
      $state.go('viewStatus',{uid:id});
    }else{
      $state.go('viewStatus',{uid:id});
    }
  };
  $scope.goBack = function(){
    $state.go('teamArea');
  }

});
