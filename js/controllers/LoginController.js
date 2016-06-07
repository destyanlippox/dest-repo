/**
 * Created by geanGin on 6/6/16.
 */
/**
 * Created by geanGin on 6/5/16.
 */
angular.module("MetronicApp").controller('LoginController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // console.log("about to load gantt");
        // $loadGantt();
        // $createGantt();
    });
});
