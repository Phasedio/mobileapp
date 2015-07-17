app.controller('updateStatusCtrl', function($scope,Auth,$state,FURL,$http) {
  $scope.updateStatus = '';
  $scope.team = Auth.team;

  $scope.getLocation = function(){
    navigator.geolocation.getCurrentPosition(function(location){
      console.log(location);
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude+','+location.coords.longitude+'&result_type=locality&key=AIzaSyD_FEFfjGW2KUzYWRFFmwMK-z9z4TRamT4').success(function(data){
        console.log(data);
        $scope.city = data.results[0].address_components[0].long_name;
      })
      //alert(location.coords.latitude +" "+ location.coords.longitude);
    })
  }

  $scope.getWeather = function(){
    //

    navigator.geolocation.getCurrentPosition(function(location){
      console.log(location);
      $http.get('https://api.forecast.io/forecast/fa3fa1922cbe995e6a83904c27835e45/'+location.coords.latitude+','+location.coords.longitude+'').success(function(data){
        console.log(data);
        $scope.weather = data.currently.summary;
      });
      //alert(location.coords.latitude +" "+ location.coords.longitude);
    });
  }

  $scope.submitStatus = function(update){
    var team = Auth.team;
    var status = {
      name: update,
      time: new Date().getTime(),
      user:Auth.user.uid,
      location:$scope.city
    };
    var teamRef = new Firebase(FURL);
    console.log(status);
    teamRef.child('team').child(team).child('task').child(Auth.user.uid).set(status);
    console.log('status set');
    $state.go('teamArea');
  }

});
