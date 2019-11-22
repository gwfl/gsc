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
})   // end .config

.run(function($rootScope, $http) {
  let ii=0, jj=0, newRS=true, tt=0, hh=0, 
    tS00 = {name:"--", scores:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            putts:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            tsF9: 0, tpF9: 0, tsB9: 0, tpB9: 0, tsR18: 0, tpR18: 0,
            tPrize: 0, th: 0, ts: 0, tw: 0,
            s: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            h: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            w: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            u1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            u2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            ct: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null] },
    grp00={ name:"__", isShown:false, accTeam:[] };

// accGroup used to control the expand/collapse feature of the accordion
  $rootScope.accGroup = [];  // grp00={ name: "__", isShown: false, accTeam: [ ] };
  for (hh = 0; hh < 18; hh++) {        
    $rootScope.accGroup.push(JSON.parse(JSON.stringify(grp00)));
  };

  $rootScope.vMatch = {when: "When", loc: "Where", pp: 0, cp: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], ch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], pz4: [25,10,5,2,0,-1,-2,-4,-6,-8] };
  $rootScope.byTeam = [];
  
  // Alpha Vantage ::  https://www.alphavantage.co/query?function=SECTOR&apikey=52DCT7KVVJXBU7VT
  
  $rootScope.getrawS = function() {
  $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Skins?api_key=key66fQg5IghIIQmb')
    .success(function (jData) {
      $rootScope.rawS = JSON.parse(JSON.stringify(jData.records));

      for (ii = 0; ii < $rootScope.rawS.length; ii++) {
        newRS = true;
        hh = $rootScope.rawS[ii].fields.Hole - 1;
        for (jj = 0; jj < $rootScope.byTeam.length; jj++) {
          if ($rootScope.byTeam[jj].name === $rootScope.rawS[ii].fields.Team) {
            newRS = false;  

            if ($rootScope.byTeam[jj].ct[hh] == null || 
                $rootScope.byTeam[jj].ct[hh] < $rootScope.rawS[ii].createdTime)  { 
            $rootScope.byTeam[jj].scores[hh] = $rootScope.rawS[ii].fields.Score;
            $rootScope.byTeam[jj].putts[hh] = $rootScope.rawS[ii].fields.Putts;
            $rootScope.byTeam[jj].ct[hh] = $rootScope.rawS[ii].createdTime;
            }
          }
        }
        if (newRS) {
          $rootScope.byTeam.push(JSON.parse(JSON.stringify(tS00)));
          jj = $rootScope.byTeam.length -1;
          $rootScope.byTeam[jj].name = $rootScope.rawS[ii].fields.Team;
          $rootScope.byTeam[jj].scores[hh] = $rootScope.rawS[ii].fields.Score;
          $rootScope.byTeam[jj].putts[hh] = $rootScope.rawS[ii].fields.Putts;   
          $rootScope.byTeam[jj].ct[hh] = $rootScope.rawS[ii].createdTime;
        }
      }
      

      for (hh=0;hh<18;hh++) { 
      for (jj = 0; jj < $rootScope.byTeam.length; jj++) {
        if (hh < 9) {        
            $rootScope.byTeam[jj].tsF9 += $rootScope.byTeam[jj].scores[hh];
            $rootScope.byTeam[jj].tpF9 += $rootScope.byTeam[jj].putts[hh];
        } else if (hh < 18) {        
            $rootScope.byTeam[jj].tsB9 += $rootScope.byTeam[jj].scores[hh];
            $rootScope.byTeam[jj].tpB9 += $rootScope.byTeam[jj].putts[hh];
        }
        $rootScope.byTeam[jj].tsR18 += $rootScope.byTeam[jj].scores[hh];
        $rootScope.byTeam[jj].tpR18 += $rootScope.byTeam[jj].putts[hh];
      }
      }

    /*    */
    });  // end http.get
  };  // end getrawS()
})   // end .run

.controller('MainCtrl', function($rootScope, $scope, $http) {

  $rootScope.getrawS();

  $scope.toggleGroup = function(group) {
    group.isShown = !group.isShown;
  };

});  // end .MainCtrl
