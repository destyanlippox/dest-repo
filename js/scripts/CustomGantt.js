/**
 * Created by geanGin on 6/5/16.
 */

jQuery.fn.ganttChart = function () {
    console.log("begin creation")
    var args = Array.prototype.slice.call(arguments);

    if (args.length == 1 && typeof(args[0]) == "object") {
        build.call(this, args[0]);
    }
}

function build(options) {
    var els = this;
    var defaults = {
        showWeekends: true,
        cellWidth: 21,
        cellHeight: 31,
        slideWidth: 400,
        vHeaderWidth: 100,
        behavior: {
            clickable: true,
            draggable: true,
            resizable: true
        }
    };

    var opts = jQuery.extend(true, defaults, options);

    if (opts.data) {
        createView();
    } else if (opts.dataUrl) {
        jQuery.getJSON(opts.dataUrl, function (data) { opts.data = data; build(); });
    }
    
    function createView() {
        var minDays = Math.floor((opts.slideWidth / opts.cellWidth)  + 5);
        var startEnd = DateUtils.getBoundaryDatesFromData(opts.data, minDays);
        opts.start = startEnd[0];
        opts.end = startEnd[1];

        els.each(function () {

            var container = jQuery(this);
            var div = jQuery("<div>", { "class": "ganttView" });
            SideView(div, opts);
            container.append(div);

            // var w = jQuery("div.ganttview-vtheader", container).outerWidth() +
            //     jQuery("div.ganttview-slide-container", container).outerWidth();
            // container.css("width", (w + 2) + "px");

            // new Behavior(container, opts).apply();
        });
    }
}

var SideView = function(div, opts){

    drawSide = function () {
        var cellHeight = opts.cellHeight;
        var data = opts.data;
        console.log(data);
        var keysOfData = Object.keys(data[0]);
        console.log("the keys "+keysOfData);
        var sideDiv = jQuery("<div>", { "class": "ganttView-sideview" });
        var headerDiv = jQuery("<div>",{"class":"ganttView-header"});
        for(var i = 0;i < keysOfData.length;i++){
            var headColDiv = jQuery("<div>",{
                'class':'headerColDiv col'+keysOfData[i]
            }).append(keysOfData[i]);
            headerDiv.append(headColDiv);
        }
        sideDiv.append(headerDiv);
        for (var i = 0; i < data.length; i++) {
            // Devine the row div
            var itemDiv = jQuery("<div>", { "class": "ganttView-data" });
            for(var rowValue in data[i]){
                if(rowValue!="Series"){
                    itemDiv.append(jQuery("<div>",{
                        "class": "ganttView-data-item col"+rowValue,
                        // "css": { "height": (data[i].Series.length * cellHeight) + "px" }
                    }).append(data[i][rowValue]));
                }else{
                    var seriesDiv = jQuery("<div>", { "class": "ganttView-data-item col"+rowValue });
                    for (var j = 0; j < data[i].Series.length; j++) {
                        seriesDiv.append(jQuery("<div>", {
                            "class": "ganttView-Series-name" })
                            .append(data[i][rowValue][j].name));
                    }
                    itemDiv.append(seriesDiv);
                }
            }
            sideDiv.append(itemDiv);
        }
        div.append(sideDiv);
    }
    drawSide();
}


var DateUtils = {

    daysBetween: function (start, end) {
        if (!start || !end) { return 0; }
        start = Date.parse(start); end = Date.parse(end);
        if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
        var count = 0, date = start.clone();
        while (date.compareTo(end) == -1) { count = count + 1; date.addDays(1); }
        return count;
    },

    isWeekend: function (date) {
        return date.getDay() % 6 == 0;
    },

    getBoundaryDatesFromData: function (data, minDays) {
        var minStart = new Date();
        var maxEnd = new Date();
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].Series.length; j++) {
                var start = Date.parse(data[i].Series[j].start);
                var end = Date.parse(data[i].Series[j].end)
                if (i == 0 && j == 0) { minStart = start; maxEnd = end; }
                if (minStart.compareTo(start) == 1) { minStart = start; }
                if (maxEnd.compareTo(end) == -1) { maxEnd = end; }
            }
        }

        // Insure that the width of the chart is at least the slide width to avoid empty
        // whitespace to the right of the grid
        if (DateUtils.daysBetween(minStart, maxEnd) < minDays) {
            maxEnd = minStart.clone().addDays(minDays);
        }

        return [minStart, maxEnd];
    }
};