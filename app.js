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
          controller: "ViewCtrl"
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
.run( function ($rootScope, $http, dbSvc) {
  //  https://gwfl.github.io/gsc/courses.json  https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Courses?api_key=key66fQg5IghIIQmb
  $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Courses?api_key=key66fQg5IghIIQmb')
  .success(function (jsonData) {
    $rootScope.vCourses = angular.copy(jsonData.records);
  });

  dbSvc.initStats;

  //  localStorage.setItem('ls_vGM00', jsonData.fields.vGMstats);

  $rootScope.vm00 = { when: "When", loc: "Where", pp: 0, ww: 0, tt: 0, 
    cp: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], ch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    jp: 0, pz4: [15, 8, 5, 3, 1, 0, -2, -4, -6, -8], mip: false };
  $rootScope.vp00 = { nm: " ", id: "", tm: "", th: 0, ts: 0, tw: 0, wolfPts: 0,
    wolf: [ { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false },
            { role: "Hunter", pts: 0, winner: false }, { role: "Hunter", pts: 0, winner: false }
          ], 
    s: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    h: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    w: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    u1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    u2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  };

  $rootScope.wwRR = ["Wolf", "Hunter", "Lone-W", "Blind-W", "(pig)", "xHunter"]; 

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
      items: [],
      show: false
    };
  }
  
})
.controller('MainCtrl', function($rootScope, $scope, $timeout, dbSvc) {

  // $rootScope.vGM00 = JSON.parse(localStorage.getItem('ls_vGM00'));
  
  var rsScore = dbSvc.scoreById.get({recId:'5879174153893a6e000036e5'}, function() {
    $scope.sVGM = rsScore.vGMstats;
    localStorage.setItem('ls_vGMstats', JSON.stringify(rsScore.vGMstats));
  });

  $scope.selCourseF = function (selCC) {
    $scope.sVGM.vm.loc = selCC.fields.Name.substring(0,15);
    var sc = JSON.parse(selCC.fields.Scorecard);
    $scope.sVGM.vm.cp = sc.par; 
    $scope.sVGM.vm.ch = sc.hcp; 
    $scope.sVGM.vm.jp = $scope.sVGM.vm.pp * $scope.sVGM.vm.ww;
  };

  $scope.uTH = function(th, rr) {
    var jj = 0;
    var th1 = 0;
    var th2 = 0;
    var aa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    th1 = Math.trunc(th / 18);
    th2 = th % 18;
    for (jj = 0; jj < 18; jj++) {
      aa[jj] = th1;
      if (parseInt(rr[jj]) <= th2) {
        aa[jj]++;
      }
    }
    return aa;
  };

  $scope.vp18 = function() {
    for (jj = 0; jj < $scope.sVGM.vm.pp; jj++) {
      $scope.sVGM.vp[jj].h = $scope.uTH($scope.sVGM.vp[jj].th, $scope.sVGM.vm.ch);
    }
    $scope.updsVGM();
  };

  $scope.wolfPts = function(jj) {
    var wxx = 1, ii = 0;
    for (ii = 0; ii < $scope.sVGM.vm.pp; ii++) {
      $scope.sVGM.vp[ii].wolf[jj].pts = 0;
      if ($scope.sVGM.vp[ii].wolf[jj].winner) {
        switch ($scope.sVGM.vp[ii].wolf[jj].role) {
         case 'xHunter': 
           $scope.sVGM.vp[ii].wolf[jj].pts = 1;
           break;
         case 'Hunter': 
           $scope.sVGM.vp[ii].wolf[jj].pts = 3;
           break;
         case 'Wolf': 
           $scope.sVGM.vp[ii].wolf[jj].pts = 2;
           break;
         case 'Lone-W': 
           $scope.sVGM.vp[ii].wolf[jj].pts = 4;
           break;
         case 'Blind-W': 
           $scope.sVGM.vp[ii].wolf[jj].pts = 2 * 3;   // triple points for Blind-W
           break;
         case '(pig)': 
           $scope.sVGM.vp[ii].wolf[jj].pts = 2 * 2;   // double points for (pig)
           break;
         default: 
           break;
         }   //  end switch
      }   //  if winner
    }   // for loop
  };   //  end scope.wolfPts

  $scope.calcTsw = function () {  
    var pz4 = -15; var s = 0; var wxx = 1;
    $scope.sVGM.vm.jp = $scope.sVGM.vm.pp * $scope.sVGM.vm.ww;
    for (ii = 0; ii < $scope.sVGM.vm.pp; ii++) {
      $scope.sVGM.vp[ii].ts = 0;
      $scope.sVGM.vp[ii].tw = 0;
      $scope.sVGM.vp[ii].wolfPts = 0;
      for (jj = 0; jj < 18; jj++) {
       if ($scope.sVGM.vp[ii].s[jj] !== null) {
        s = $scope.sVGM.vp[ii].s[jj] - $scope.sVGM.vp[ii].h[jj];
        if (s < -4) { s = -4; }
        if (s < 6) { pz4 = $scope.sVGM.vm.pz4[s +4]; }
        $scope.sVGM.vp[ii].w[jj] = pz4;
        $scope.sVGM.vp[ii].tw += pz4 + $scope.sVGM.vp[ii].u2[jj];
        $scope.sVGM.vp[ii].ts += $scope.sVGM.vp[ii].s[jj] + $scope.sVGM.vm.cp[jj];

        $scope.wolfPts(jj);
        $scope.sVGM.vp[ii].wolfPts += $scope.sVGM.vp[ii].wolf[jj].pts;
      } }
      $scope.sVGM.vm.jp -= $scope.sVGM.vp[ii].tw;
    }
    $scope.updsVGM();   
  };

  $scope.updMatch = function() {
    $scope.sVGM.vp = [];  
    $scope.sVGM.vp.length = $scope.sVGM.vm.pp;
    for (ii = 0; ii < $scope.sVGM.vm.pp; ii++) {
      $scope.sVGM.vp[ii] = angular.copy($rootScope.vp00);
    }
    $scope.updsVGM();   //  updMatch()
  };
  $scope.clearMatch = function() {
    $scope.sVGM.vm = angular.copy($rootScope.vm00);
    $scope.updMatch();
  };

  // for (var j=0; j < $scope.sVGM.vm.pp; j++) {
    // $rootScope.groups[i].items.push(i + '-' + j);
  // }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
  */
  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };

  $scope.adjVP = function (kk, ppIdx, hhIdx, ss) {  
    $scope.sVGM.vp[ppIdx].s[hhIdx] += 0;
    switch (ss) {
      case 's':
        $scope.sVGM.vp[ppIdx].s[hhIdx] += kk;
        break;
      case 'u':
        $scope.sVGM.vp[ppIdx].u2[hhIdx] += kk;
        break;
      default:
        break;
    }
    $scope.calcTsw();
  };

  $scope.updsVGM = function () {  
    $scope.sVGM.urc += 1;
    dbSvc.scoreById.update({recId:'5879174153893a6e000036e5'}, {type: "ngR.update", idx: Date.now(), vGMstats: $scope.sVGM});
  };
  
})
.controller('ViewCtrl', function($rootScope, $scope, $timeout, dbSvc) {

$scope.timer = function() {
  var rsScore = dbSvc.scoreById.get({recId:'5879174153893a6e000036e5'}, function() {
    $rootScope.vGm = rsScore.vGMstats;
    localStorage.setItem('ls_vGMstats', JSON.stringify(rsScore.vGMstats));
  });
  // $rootScope.appLog += 'y';
  $timeout($scope.timer, 1500);    // 1.5 second delay
};
$timeout($scope.timer, 50);

})
.factory('dbSvc', function ($resource, $http) {

  var _initStats = function () {   // recMqVmgrTh17ixkj     // /recKbHjCbXLbJuSuJ
    $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Players/recMqVmgrTh17ixkj?api_key=key66fQg5IghIIQmb')
      .success(function (jsonData) {
        localStorage.setItem('ls_vGM00', jsonData.fields.vGMstats);
    });
  };

//    return $resource('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Players?api_key=key66fQg5IghIIQmb');

  var _ngrScores = function () {
    var url = 'https://gwfl-256d.restdb.io/rest/scores/apikey=5821f61550e9b39131fe1b6f';    //  5a6b9e9da07bee72000109a7   5879174153893a6e000036e5
    return $resource(url,      
    { create: { method: 'POST' } }
  )};

  var _scoreById = function () {
    var url = 'https://gwfl-256d.restdb.io/rest/scores/:recId?apikey=5821f61550e9b39131fe1b6f';    //  5a6b9e9da07bee72000109a7   5879174153893a6e000036e5
    return $resource(url,      
    { recId: '@_id' }, 
    { update: { method: 'PUT' } }
  )};
    
  return {
    initStats: _initStats(),
    scoreById: _scoreById(),
    ngrScores: _ngrScores()
  };
});
