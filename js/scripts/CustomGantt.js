/**
 * Created by geanGin on 6/5/16.
 */

jQuery.fn.ganttChart = function () {

    var args = Array.prototype.slice.call(arguments);

    if (args.length == 1 && typeof(args[0]) == "object") {
        build.call(this, args[0]);
    }else if (args.length == 2 && typeof(args[0]) == "string") {
        handleMethod.call(this, args[0], args[1]);
    }
};

function handleMethod(method, value) {

    if (method == "setSlideWidth") {
        var div = $("div.ganttView", this);
        div.each(function () {
            var vtWidth = $("div.ganttView-sideview", div).outerWidth();
            $(div).width(vtWidth + value + 1);
            $("div.ganttView-slide-container", this).width(value);
        });
    }
}

function build(options) {
    var els = this;
    var defaults = {
        showWeekends: true,
        cellWidth: 21,
        cellHeight: 31,
        slideWidth: 300,
        dataUrl: "",
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

            var w = jQuery("div.ganttView-sideview", container).outerWidth() +
                jQuery("div.ganttView-slide-container", container).outerWidth();
            container.css("width", (w + 2) + "px");

            new Behavior(container, opts).apply();
        });
    }
}

var SideView = function(div, opts){

    var drawSide = function () {
        var data = opts.data;

        var keysOfData = Object.keys(data[0]);

        var sideDiv = jQuery("<div>", { "class": "ganttView-sideview" });
        var headerDiv = jQuery("<div>",{"class":"ganttView-header"});
        for(var idx = 0;idx < keysOfData.length;idx++){
            var headColDiv = jQuery("<div>",{
                'class':'headerColDiv col'+keysOfData[idx]
            }).append(keysOfData[idx]);
            headerDiv.append(headColDiv);
        }
        sideDiv.append(headerDiv);
        for (var i = 0; i < data.length; i++) {
            // Devine the row div
            var itemDiv = jQuery("<div>", { "class": "ganttView-data" });
            for(var rowValue in data[i]){
                if(rowValue!="Series"){
                    itemDiv.append(jQuery("<div>",{
                        "class": "ganttView-data-item col"+rowValue
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
    };

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Creates a 3 dimensional array [year][month][day] of every day
    // between the given start and end dates
    function getDates(start, end) {
        var dates = [];
        dates[start.getFullYear()] = [];
        dates[start.getFullYear()][start.getMonth()] = [start]
        var last = start;
        while (last.compareTo(end) == -1) {
            var next = last.clone().addDays(1);
            if (!dates[next.getFullYear()]) { dates[next.getFullYear()] = []; }
            if (!dates[next.getFullYear()][next.getMonth()]) {
                dates[next.getFullYear()][next.getMonth()] = [];
            }
            dates[next.getFullYear()][next.getMonth()].push(next);
            last = next;
        }
        return dates;
    }

    var addHzHeader = function(div, dates, cellWidth) {
        var headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
        var monthsDiv = jQuery("<div>", { "class": "ganttview-hzheader-months" });
        var daysDiv = jQuery("<div>", { "class": "ganttview-hzheader-days" });
        var totalW = 0;
        for (var y in dates) {
            for (var m in dates[y]) {
                var w = dates[y][m].length * cellWidth;
                totalW = totalW + w;
                monthsDiv.append(jQuery("<div>", {
                    "class": "ganttview-hzheader-month",
                    "css": { "width": (w - 1) + "px" }
                }).append(monthNames[m] + "/" + y));
                for (var d in dates[y][m]) {
                    daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day" })
                        .append(dates[y][m][d].getDate()));
                }
            }
        }
        monthsDiv.css("width", totalW + "px");
        daysDiv.css("width", totalW + "px");
        headerDiv.append(monthsDiv).append(daysDiv);
        div.append(headerDiv);
    }

    function addGrid(div, data, dates, cellWidth, showWeekends) {
        var gridDiv = jQuery("<div>", { "class": "ganttview-grid" });
        var rowDiv = jQuery("<div>", { "class": "ganttview-grid-row" });
        for (var y in dates) {
            for (var m in dates[y]) {
                for (var d in dates[y][m]) {
                    var cellDiv = jQuery("<div>", { "class": "ganttview-grid-row-cell" });
                    if (DateUtils.isWeekend(dates[y][m][d]) && showWeekends) {
                        cellDiv.addClass("ganttview-weekend");
                    }
                    rowDiv.append(cellDiv);
                }
            }
        }
        var w = jQuery("div.ganttview-grid-row-cell", rowDiv).length * cellWidth;
        rowDiv.css("width", w + "px");
        gridDiv.css("width", w + "px");
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].Series.length; j++) {
                gridDiv.append(rowDiv.clone());
            }
        }
        div.append(gridDiv);
    }

    function addBlockContainers(div, data) {
        var blocksDiv = jQuery("<div>", { "class": "ganttview-blocks" });
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].Series.length; j++) {
                blocksDiv.append(jQuery("<div>", { "class": "ganttview-block-container" }));
            }
        }
        div.append(blocksDiv);
    }

    function addBlocks(div, data, cellWidth, start) {
        var rows = jQuery("div.ganttview-blocks div.ganttview-block-container", div);
        var rowIdx = 0;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].Series.length; j++) {
                var series = data[i].Series[j];
                var size = DateUtils.daysBetween(series.start, series.end) + 1;
                var offset = DateUtils.daysBetween(start, series.start);
                var block = jQuery("<div>", {
                    "class": "ganttview-block",
                    "title": series.name + ", " + size + " days",
                    "css": {
                        "width": ((size * cellWidth) - 9) + "px",
                        "margin-left": ((offset * cellWidth) + 3) + "px"
                    }
                });
                addBlockData(block, data[i], series);
                if (data[i].Series[j].color) {
                    block.css("background-color", data[i].Series[j].color);
                }
                block.append(jQuery("<div>", { "class": "ganttview-block-text" }).text(size));
                jQuery(rows[rowIdx]).append(block);
                rowIdx = rowIdx + 1;
            }
        }
    }

    function addBlockData(block, data, series) {
        // This allows custom attributes to be added to the series data objects
        // and makes them available to the 'data' argument of click, resize, and drag handlers
        var blockData = { id: data.id, name: data.name };
        jQuery.extend(blockData, series);
        block.data("block-data", blockData);
    }

    function applyLastClass(div) {
        jQuery("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
        jQuery("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
        jQuery("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
    }

    var drawCalendar = function () {
        var slideDiv = jQuery("<div>", {
            "class": "ganttView-slide-container",
            "css": { "width": opts.slideWidth + "px" }
        });
        var dates = getDates(opts.start, opts.end);
        addHzHeader(slideDiv, dates, opts.cellWidth);
        addGrid(slideDiv, opts.data, dates, opts.cellWidth, opts.showWeekends);
        addBlockContainers(slideDiv, opts.data);
        addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start);
        div.append(slideDiv);
        applyLastClass(div.parent());
    }
    drawSide();
    drawCalendar();
};


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
                var end = Date.parse(data[i].Series[j].end);
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

var Behavior = function (div, opts) {

    function apply() {

        if (opts.behavior.clickable) {
            bindBlockClick(div, opts.behavior.onClick);
        }

        if (opts.behavior.resizable) {
            bindBlockResize(div, opts.cellWidth, opts.start, opts.behavior.onResize);
        }

        if (opts.behavior.draggable) {
            bindBlockDrag(div, opts.cellWidth, opts.start, opts.behavior.onDrag);
        }
    }

    function bindBlockClick(div, callback) {
        jQuery("div.ganttview-block", div).live("click", function () {
            if (callback) { callback(jQuery(this).data("block-data")); }
        });
    }

    function bindBlockResize(div, cellWidth, startDate, callback) {
        jQuery("div.ganttview-block", div).resizable({
            grid: cellWidth,
            handles: "e,w",
            stop: function () {
                var block = jQuery(this);
                updateDataAndPosition(div, block, cellWidth, startDate);
                if (callback) { callback(block.data("block-data")); }
            }
        });
    }

    function bindBlockDrag(div, cellWidth, startDate, callback) {
        jQuery("div.ganttview-block", div).draggable({
            axis: "x",
            grid: [cellWidth, cellWidth],
            stop: function () {
                var block = jQuery(this);
                updateDataAndPosition(div, block, cellWidth, startDate);
                if (callback) { callback(block.data("block-data")); }
            }
        });
    }

    function updateDataAndPosition(div, block, cellWidth, startDate) {
        console.log("droped");
        var container = jQuery("div.ganttView-slide-container", div);
        var scroll = container.scrollLeft();
        var offset = block.offset().left - container.offset().left + scroll;

        // Set new start date
        var daysFromStart = Math.round(offset / cellWidth);
        var newStart = startDate.clone().addDays(daysFromStart);
        block.data("block-data").start = newStart;

        // Set new end date
        var width = block.outerWidth();
        var numberOfDays = Math.round(width / cellWidth) - 1;
        block.data("block-data").end = newStart.clone().addDays(numberOfDays);
        jQuery("div.ganttview-block-text", block).text(numberOfDays + 1);

        // Remove top and left properties to avoid incorrect block positioning,
        // set position to relative to keep blocks relative to scrollbar when scrolling
        block.css("top", "").css("left", "")
            .css("position", "relative").css("margin-left", offset + "px");
    }

    return {
        apply: apply
    };
}