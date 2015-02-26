/* globals d3, moment, $ */

$(function() {
    
    var margins = { top: 20, bottom: 20, left: 40, right: 20 };
    var plotHeight = 400;
    var plotWidth = 600;
    var dateFormat = "yy-mm-dd";
    
    var svg = d3.select('svg')
        .attr("width", plotWidth + margins.left + margins.right)
        .attr("height", plotHeight + margins.top + margins.bottom);
        
    var chart = svg.append("g")
        .attr("width", plotWidth)
        .attr("height", plotHeight)
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
        
    $("#from").datepicker({
        defaultDate: "-2",
        changeMonth: true,
        dateFormat: dateFormat,
        maxDate: "-2",
        onClose: function( selectedDate ) {
            var toMin = moment(selectedDate).add(1, "days").format("YYYY-MM-DD");
            $("#to").datepicker("option", "minDate", toMin);
        }
    });
    $("#to").datepicker({
        defaultDate: "-1",
        changeMonth: true,
        dateFormat: dateFormat,
        maxDate: "-1",
        onClose: function( selectedDate ) {
            var fromMax = moment(selectedDate).add(-1, "days").format("YYYY-MM-DD");
            $("#from").datepicker("option", "maxDate", fromMax);
        }
    });
        
    $('button#updateChart').click(function() {
    
        var part1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22";
        var part2 = "%22%20and%20startDate%20%3D%20%22";
        var part3 = "%22%20and%20endDate%20%3D%20%22";
        var part4 = "2010-03-10%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
        
        d3.selectAll('.line').remove();
        d3.selectAll('.axis').remove();
        
        var from = $("#from").val();
        var to = $("#to").val();
        var stock = $('#stock').val();
        
        $.get(part1 + stock + part2 + from + part3 + to + part4, {}, function(results) {
            
            var data = results.query.results.quote;
        
            var xScale = d3.time.scale()
                .domain([moment(from), moment(to)])
                .range([0, plotWidth]);
            var yScale = d3.scale.linear()
                .domain([d3.min(data, function(d) { return +d.Close; }), d3.max(data, function(d) { return +d.Close; })])
                .range([plotHeight, 0]);
                
            var lineGen = d3.svg.line()
                .x(function(d) {
                    return xScale(moment(d.Date));
                })
                .y(function(d) {
                    return yScale(+d.Close);
                });
            chart.append('svg:path')
                .attr('d', lineGen(data))
                .attr("class", "line");
              
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");
                
            chart.append("svg:g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + plotHeight + ")")
                .call(xAxis);
              
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");
                
            chart.append("svg:g")
                .attr("class", "axis")
                .call(yAxis);
        });
    });
});