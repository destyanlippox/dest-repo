/**
 * Created by geanGin on 6/5/16.
 */
angular.module("MetronicApp").controller('GanttController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        console.log("about to load gantt");
        // $loadGantt();
        $createGantt();
    });


    $scope.project = {};

    $scope.project.name = "Project Name Dummy";

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = true;

    $loadGantt = function () {
        $("#ganttChart").ganttView({
            data: ganttData,
            slideWidth: 500,
            behavior: {
                onClick: function (data) {
                    var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                    $("#eventMessage").text(msg);
                },
                onResize: function (data) {
                    var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                    $("#eventMessage").text(msg);
                },
                onDrag: function (data) {
                    var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                    $("#eventMessage").text(msg);
                }
            }
        });
    }
    
    $createGantt = function () {
        $("#ganttChart").ganttChart({
            data: ganttData,
            slideWidth: 520,
            behavior: {
                onClick: function (data) {
                    var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                    $("#eventMessage").text(msg);
                },
                onResize: function (data) {
                    var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                    $("#eventMessage").text(msg);
                },
                onDrag: function (data) {
                    var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                    $("#eventMessage").text(msg);
                }
            }
        });
    }

});
