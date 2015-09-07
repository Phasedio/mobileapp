app.controller('updateStatusCtrl', function($scope,Auth,$state,FURL,$http,Team,$cordovaStatusbar) {
  //cordova.plugins.Keyboard.disableScroll(true);
  //$cordovaStatusbar.hide();
  $scope.updateStatus = '';
  $scope.team = Auth.team;
  $scope.weather = '';
  $scope.city = '';
  $scope.lat = '';
  $scope.long = '';
  $scope.bgPhoto = '';
  $scope.photo ='';
  $scope.weatherIcon = 'img/weather.svg';
  $scope.task = 'current';
  $scope.filter = '';



  $scope.goBack = function(){
    $state.go('teamArea');
  }

  $scope.getLocation = function(){
    if ($scope.lat){

      document.getElementById("loc").className =
        document.getElementById("loc").className.replace( /(?:^|\s)active(?!\S)/g , '' );


      $scope.lat ='';
      $scope.long ='';
      $scope.city = '';
    }else{
      var ic = document.getElementById('loc');
      ic.className = ic.className + " active";
      navigator.geolocation.getCurrentPosition(function(location){
        console.log(location);
        $scope.lat =location.coords.latitude;
        $scope.long =location.coords.longitude;
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude+','+location.coords.longitude+'&result_type=locality&key=AIzaSyD_FEFfjGW2KUzYWRFFmwMK-z9z4TRamT4').success(function(data){
          console.log(data);
          $scope.city = data.results[0].address_components[0].long_name;
        });
      });
    }
  };

  $scope.getWeather = function(){
    if($scope.weather){
      $scope.weather = '';
    }else{
      navigator.geolocation.getCurrentPosition(function(location){
        console.log(location);
        $http.get('https://api.forecast.io/forecast/fa3fa1922cbe995e6a83904c27835e45/'+location.coords.latitude+','+location.coords.longitude+'').success(function(data){
          console.log(data);
          $scope.weatherIcon = getWeatherIcon(data.currently.icon);
          //$scope.weather = data.currently.summary;
        });
      });
    }
  };
  $scope.takePhoto = function (){
    var ic = document.getElementById('ph');
    ic.className = ic.className + " active";

    var cameraOptions = {
       quality : 100,
       targetWidth: 375,
       targetHeight: 667,
       allowEdit : false,
       encodingType: Camera.EncodingType.JPEG,
       destinationType : Camera.DestinationType.DATA_URL,
       sourceType : Camera.PictureSourceType.CAMERA
     };
    navigator.camera.getPicture(function(imageURI) {
      $scope.bgPhoto = 'data:image/jpeg;base64,'+imageURI;
      $scope.filter = "background:rgba(0,0,0,0.5)";
      $scope.$apply();
      }, function(err) {

        // Ruh-roh, something bad happened
        alert('error there was an issue with your photo');

      }, cameraOptions);
  }


  $scope.submitStatus = function(update){
    
    console.log(update);
    console.log($scope.updateStatus);
    update = $scope.updateStatus;
    var taskPrefix = getTaskPrefix();
    var team = Auth.team;
    var weather,city,lat,long,photo;
    weather = $scope.weatherIcon != '' ? $scope.weatherIcon : 0;
    city = $scope.city ? $scope.city : 0;
    lat = $scope.lat ? $scope.lat : 0;
    long = $scope.long ? $scope.long : 0;
    photo = $scope.bgPhoto ? $scope.bgPhoto : 0;
    var status = {
      name: taskPrefix+update,
      time: new Date().getTime(),
      user:Auth.user.uid,
      city:city,
      weather:weather,
      taskPrefix : taskPrefix,
      photo : photo,
      location:{
        lat : lat,
        long : long
      }

    };
    var teamRef = new Firebase(FURL);
    console.log(status);
    teamRef.child('team').child(team).child('task').child(Auth.user.uid).set(status);
    teamRef.child('team').child(team).child('all').child(Auth.user.uid).push(status,function(){
      console.log('status set');
      $scope.updateStatus = '';

      //Send push notifications to team
      $http.get('http://45.55.200.34:8080/push/update/'+team+'/'+Auth.user.name+'/'+status.name,'').success(function(data){
        //alert(data);
      });

      // hard reset
      // $scope.updateStatus = '';
      // $scope.team = Auth.team;
      // $scope.weather = '';
      // $scope.city = '';
      // $scope.lat = '';
      // $scope.long = '';
      // $scope.bgPhoto = '';
      // $scope.photo ='';
      // $scope.weatherIcon = 'img/weather.svg';
      // $scope.task = 'current';
      // $scope.filter = '';
      Team.removeTeam();
      $state.go('teamArea');
    });
    

    
  }

  $scope.changePrefix = function(x){
    $scope.task = x;
  }

  function getTaskPrefix(){
    var r = '';
    switch ($scope.task){
      case 'current':
        r = 'Is currently ';
        break;
      case 'starting':
        r = 'Has started ';
        break;
      case 'finsh':
        r = 'Has finshed ';
        break;    
    }
    return r;
  }
  function getWeatherIcon(icon){
    var final;
    switch (icon) {
      case 'clear-day':
      case 'clear-night':
          final = 'img/sunny.svg'
        break;
      case 'rain':
        final = 'img/rain.svg';
        break;
      case 'snow':
      case 'sleet':
          final = 'img/snow.svg';
          break;
      case 'wind':
      case 'cloudy':
            final = "img/cloudy.svg";
            break;
      case 'thunderstorm':
      case 'tornado':
              final = 'thunder.svg';
              break;
      case 'partly-cloudy-day':
      case 'partly-cloudy-night':
              final = 'img/partly-cloudy.svg';
              break;
      default:
          final = 'img/partly-cloudy.svg';
    }
    return final;
  }

});
