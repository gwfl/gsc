angular.module('ionicApp', ['ionic', 'ngResource'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
   .state('eventmenu', {
    url: "/event",
    abstract: true,
    templateUrl: "templates/event-menu.html"
   })
   .state('eventmenu.home', {
    url: "/home",
    views: {
     'menuContent': {
      templateUrl: "templates/home.html",
      controller: "MainCtrl"
     }
    }
   });

  $urlRouterProvider.otherwise("/event/home");
 })
 .run(function($rootScope, $http) {
  let ii=0, jj=0, newRS=0, hh=0, tS01={};
 
  // global variables  $rootScope
  var tS00 = {"Team":"--", "Scores":[0,0,0,0,0,0,0,0,0], "Putts":[0,0,0,0,0,0,0,0,0] };
  $rootScope.Teams = [];

  // alert($rootScope.rawS.length);
  $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Skins?api_key=key66fQg5IghIIQmb')
    .success(function (jData) {
      $rootScope.rawS = JSON.parse(JSON.stringify(jData.records));

      for (ii = 0; ii < $rootScope.rawS.length; ii++) {
        newRS = -1;
        for (jj = 0; jj < $rootScope.Teams.length; jj++) {
          if ($rootScope.Teams[jj].Team === $rootScope.rawS[ii].fields.Team) {
            newRS = jj; hh = $rootScope.rawS[ii].fields.Hole - 1;
            $rootScope.Teams[jj].Scores[hh] = $rootScope.rawS[ii].fields.Score;
            $rootScope.Teams[jj].Putts[hh] = $rootScope.rawS[ii].fields.Putts;
          }
        }
        if (newRS < 0) {
          tS01 = JSON.parse(JSON.stringify(tS00));
          tS01.Team = $rootScope.rawS[ii].fields.Team;
          hh = $rootScope.rawS[ii].fields.Hole - 1;
          tS01.Scores[hh] = $rootScope.rawS[ii].fields.Score;   
          tS01.Putts[hh] = $rootScope.rawS[ii].fields.Putts;   
          $rootScope.Teams.push(JSON.parse(JSON.stringify(tS01)));
        }
      }
    });

})
.controller('MainCtrl', function($rootScope, $scope, $http) {
  
});

// More code goes here ...
