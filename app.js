angular.module('gscAppH', ['ionic', 'ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "home.html",
          controller: "appCtrl"
        }
      }
    })
    .state('eventmenu.match', {
      url: "/match",
      views: {
        'menuContent' :{
          templateUrl: "match.html",
          controller: "appCtrl"
        }
      }
  });
  
  $urlRouterProvider.otherwise("/event/home");
})
.run( function ($rootScope, $http, geoSvc) {

//  $rootScope.vCourses = [];
  $rootScope.vGM00    = {};
  $rootScope.vGm      = {"vm": { "loc": "Select", "cp": [], "t0": [], "lat": [], "lon": [] }};
  $rootScope.coords = {"lat": 0, "lon": 0};
  $rootScope.geoArr   = { "lat": [ 33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8,33.8 ],
                          "lon": [ -118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3,-118.3 ]  };

  // get list of known Courses
 // $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Courses?api_key=key66fQg5IghIIQmb')
 // .success(function (jsonData) {
 //   $rootScope.vCourses = angular.copy(jsonData.records);
 // });
	
  geoSvc.initrScope();

         var watchID;

            if(navigator.geolocation){
               // timeout at 60000 milliseconds (60 seconds)
               var options = {enableHighAccuracy: true, maximumAge:3000, timeout: 10000};
  //             alert("pos-1");
    navigator.geolocation.watchPosition(function(pos) {
      $rootScope.coords.lat = pos.coords.latitude;
      $rootScope.coords.lon = pos.coords.longitude;
    }, function(err) {
      alert('Unable1 to get location: ' + err.message);
    }, options);
            } else {
               alert("Sorry, your browser does not support geolocation!");
            }

  $rootScope.xxTimes = function (nn) {
   var ii = 0;
   var aa = [];
   for (ii = 0; ii < nn; ii++) {
     if (arguments.length > 1) {
       aa[ii] = arguments[1];
     } else {
      aa[ii] = ii;
     }
   }
    return aa;
  };

  $rootScope.groups = [];
  for (var i=0; i<18; i++) {
    $rootScope.groups[i] = {
      name: i+1,
      geoD: 0,
      show: false
    };
  }
  
})
.controller('appCtrl', function ($rootScope, $scope, $ionicModal, geoSvc) {
  $scope.sVGM  = {"vm": { "loc": "", "cp": [], "t0": [], "lat": [], "lon": [] }};

  $scope.selCourseF = function (selCC) {
    $scope.sVGM.vm.loc = selCC.fields.Name.substring(0,15);
    var sc = JSON.parse(selCC.fields.Scorecard);
    $scope.sVGM.vm.cp = sc.par; 
    $scope.sVGM.vm.t0 = sc.t0; 
    $scope.sVGM.vm.lat = sc.lat; 
    $scope.sVGM.vm.lon = sc.lon; 
    $rootScope.vGm = $scope.sVGM;
    $rootScope.geoArr.lat = sc.lat;
    $rootScope.geoArr.lon = sc.lon;
    $scope.geoCalc();
  };

  $scope.geoCalc = function() {
  for (var jj=0; jj < 18; jj++) {
    $rootScope.groups[jj].geoD = geoSvc.geoDist($rootScope.geoArr.lat[jj], $rootScope.geoArr.lon[jj], $rootScope.coords.lat, $rootScope.coords.lon, 'K'); 
    if ($rootScope.groups[jj].geoD < 1) { $rootScope.groups[jj].geoD = Math.round($rootScope.groups[jj].geoD * 1100); }
    else { $rootScope.groups[jj].geoD = $rootScope.groups[jj].geoD * 0.621; }
  }
  };

  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };

})
.factory('geoSvc', function ($rootScope, $resource, $http) {

var _initrScope = function () {   // recMqVmgrTh17ixkj     // /recKbHjCbXLbJuSuJ

  // init Match JSON template
  $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Players/recMqVmgrTh17ixkj?api_key=key66fQg5IghIIQmb')
      .success(function (jsonData) {
        localStorage.setItem('ls_vGM00', jsonData.fields.vGMstats);
        $rootScope.vGM00 = JSON.parse(jsonData.fields.vGMstats);
  });

  // get list of known Courses
  $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Courses?api_key=key66fQg5IghIIQmb')
  .success(function (jsonData) {
    $rootScope.vCourses = angular.copy(jsonData.records);
  });

};

var _ngrUtil = function () {
    var url = 'https://gwfl-256d.restdb.io/rest/utility?apikey=5821f61550e9b39131fe1b6f';    //  5a6b9e9da07bee72000109a7   5ae78ec6150b711200002e1a
    return $resource(url,      
    { create: { method: 'POST' } }
  )};

var _scoreById = function () {
    var url = 'https://gwfl-256d.restdb.io/rest/scores/:recId?apikey=5821f61550e9b39131fe1b6f';    //  5a6b9e9da07bee72000109a7   5879174153893a6e000036e5 5ae78ec6150b711200002e1a  
    return $resource(url,      
    { recId: '@_id' }, 
    { update: { method: 'PUT' } },
    { create: { method: 'POST' } }
  )};
  
var _geoDist = function (lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515 / 1760;
	if (unit=="K") { dist = dist * 1.609344 * 1760 }
	if (unit=="N") { dist = dist * 0.8684 * 1760 }
	return dist;
};

return {
  geoDist:    _geoDist,
  initrScope: _initrScope,
  scoreById:  _scoreById(),
  ngrUtil:    _ngrUtil()
};

});
