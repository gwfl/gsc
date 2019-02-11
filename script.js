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
  var ii = 0;
  var jj = 0;
  // global variables  $rootScope
  $rootScope.cusRecipe = { "crSolv": "sBB", "crArr": [ {"cas": "c00001", "conc": 101}, {"cas": "c00002", "conc": 201}, {"cas": "c00003", "conc": 301}, {"cas": "c00004", "conc": 401}, {"cas": "c00005", "conc": 499}  ] };

 /*
recipe from screen:  solv + casArr;
for each cas from recipe, lookup rSolv[key].casArr[key2].cas
Convert concentration to standard UOM
return lowest shelf life;  check concentration range;  choose solvent
check analyte master list;  inorganic / organic
*/
    $http.get('https://api.airtable.com/v0/app0hohtq4b1nM0Kb/Solvents/recQH2Vz0tLC8Qfbq?api_key=key66fQg5IghIIQmb') 
      .success(function (jsonData) {
        $rootScope.rSolv = JSON.parse(jsonData.fields.Analytes);
    });

  $rootScope.xxTimes = function(nn) {
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

})
.controller('MainCtrl', function($rootScope, $scope, $http) {

 $scope.valRecipe = function() {
   // alert('valRecipe');
 for (var key in $rootScope.rSolv) {

  if ($rootScope.cusRecipe.crSolv === $rootScope.rSolv[key].solv) { 
       alert($rootScope.rSolv[key].solv);
     
     for (var key2 in $rootScope.rSolv[key].casArr) {
       if ($rootScope.cusRecipe.crArr[0].cas === $rootScope.rSolv[key].casArr[key2].cas) { 
          alert($rootScope.rSolv[key].casArr[0].cas);
          alert($rootScope.rSolv[key].casArr[0].maxconc);
          // alert(rSolv[key].casArr[0].shlife);
          if ( $rootScope.cusRecipe.crArr[0].conc <= $rootScope.rSolv[key].casArr[0].maxconc) {
            alert($rootScope.rSolv[key].casArr[0].maxconc);
            }
          else { 
            alert("conc fallout");
          }
          alert($rootScope.rSolv[key].casArr[0].shlife);
       }
     }
  }
}

 };
 
});
