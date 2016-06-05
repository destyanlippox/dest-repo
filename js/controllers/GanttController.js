/**
 * Created by geanGin on 6/5/16.
 */
angular.module("MetronicApp").controller('GanttController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        console.log("about to load gantt");
        $loadGantt();
    });

    $scope.project = {};

    $scope.project.name = "Project Name Dummy";

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $loadGantt = function () {

        // var data = [{ "name": "Step A "
        //     ,"desc": "Step B"
        //     ,"values":
        //         [{ "id"          : "b0"
        //             , "from"       : "/Date(1320182000000)/"
        //             , "to"         : "/Date(1320301600000)/"
        //             , "desc"       : "Id: 0<br/>Name: Step A"
        //             , "label"      : "Step 1"
        //             , "customClass": "ganttRed"
        //         }]
        //     ,"isFile":false
        // }];
        //
        // jQuery(".gantt").gantt({
        //     source: data
        // });
        $("#ganttChart").ganttView({
            data: ganttData,
            slideWidth: 700,
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
