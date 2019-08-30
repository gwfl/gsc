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
          controller: "MainCtrl"
        }
      }
    })
    .state('eventmenu.match', {
      url: "/match",
      views: {
        'menuContent' :{
          templateUrl: "match.html",
          controller: "MainCtrl"
        }
      }
    })
    .state('eventmenu.ALLscores', {
      url: "/ALLscores",
      views: {
        'menuContent' :{
          templateUrl: "scores.html",
          controller: "MainCtrl"
        }
      }
  });
  
  $urlRouterProvider.otherwise("/event/home");
})
.run(function($rootScope, $http) {
  let ii=0, jj=0, newRS=0, hh=0, tS01={};
  var tS00 = {"Team":"--", "Scores":[0,0,0,0,0,0,0,0,0], "Putts":[0,0,0,0,0,0,0,0,0], "tsF9": 0, "tpF9": 0, "tsB9": 0, "tpB9": 0, "tsR18": 0, "tpR18": 0, "tPrize": 0 };
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

      for (jj = 0; jj < $rootScope.Teams.length; jj++) {
      for (hh = 0; hh < $rootScope.Teams[jj].Scores.length; hh++) {
        if (hh < 9) {
          $rootScope.Teams[jj].tsF9 += $rootScope.Teams[jj].Scores[hh];
          $rootScope.Teams[jj].tpF9 += $rootScope.Teams[jj].Putts[hh];
        } else {
          $rootScope.Teams[jj].tsB9 += $rootScope.Teams[jj].Scores[hh];
          $rootScope.Teams[jj].tpB9 += $rootScope.Teams[jj].Putts[hh];
        }
      }
      $rootScope.Teams[jj].tsR18 = $rootScope.Teams[jj].tsF9 + $rootScope.Teams[jj].tsB9;
      $rootScope.Teams[jj].tpR18 = $rootScope.Teams[jj].tpF9 + $rootScope.Teams[jj].tpB9;
      }
    });
})
.controller('MainCtrl', function($rootScope, $scope, $http) {
  
});
