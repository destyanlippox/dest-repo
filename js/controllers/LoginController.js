/**
 * Created by geanGin on 6/6/16.
 */
/**
 * Created by geanGin on 6/5/16.
 */
angular.module("MetronicApp").controller('LoginController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        // App.initAjax();
        $scope.controls = "LoginController";
    });

    $scope.submitLogin = function () {
        console.log("logit");
        console.log($scope.username);
        console.log($scope.password);
    }
});
