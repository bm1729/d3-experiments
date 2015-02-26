/* globals d3, moment, $ */

function lineChart() {
    
    var marginTop =  20;
    var marginBottom = 20;
    var marginLeft = 40;
    var marginRight = 20;
    var plotHeight = 400;
    var plotWidth = 600;
    
    var x = function(d) {
        return moment(d.Date);
    };
    
    var y = function(d) {
        return +d.Close;
    };
    
    function chart (selection) {
        selection.each(function(data) {
            
            // Blitz the svg area
            d3.select(this).selectAll("svg").remove();
            
            // Create the svg element if it doesn't exist
            var svg = d3.select(this).selectAll("svg").data([data])
                .enter()
                .append("svg")
                .attr("width", plotWidth + marginLeft + marginRight)
                .attr("height", plotHeight + marginTop + marginBottom);
            
            // Create the chart area
            var chart = svg.append("g")
                .attr("width", plotWidth)
                .attr("height", plotHeight)
                .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
                
            var xScale = d3.time.scale()
                .domain([d3.min(data, x), d3.max(data, x)])
                .range([0, plotWidth]);
            var yScale = d3.scale.linear()
                .domain([d3.min(data, y), d3.max(data, y)])
                .range([plotHeight, 0]);
                
            var lineGen = d3.svg.line()
                .x(function(d) {
                    return xScale(x(d));
                })
                .y(function(d) {
                    return yScale(y(d));
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
    }
    
    chart.marginTop = function(value) {
        if (!arguments.length) {
            return marginTop;
        }
        marginTop = value;
        return chart;
    };
    
    chart.marginBottom = function(value) {
        if (!arguments.length) {
            return marginBottom;
        }
        marginBottom = value;
        return chart;
    };
    
    chart.marginLeft = function(value) {
        if (!arguments.length) {
            return marginLeft;
        }
        marginLeft = value;
        return chart;
    };
    
    chart.marginRight = function(value) {
        if (!arguments.length) {
            return marginRight;
        }
        marginRight = value;
        return chart;
    };
    
    chart.plotHeight = function(value) {
        if (!arguments.length) {
            return plotHeight;
        }
        plotHeight = value;
        return chart;
    };
    
    chart.plotWidth = function(value) {
        if (!arguments.length) {
            return plotWidth;
        }
        plotWidth = value;
        return chart;
    };
    
    return chart;
}

$(function() {
    
    setupDatepickers();
    
    var chart = lineChart();
    var selection = d3.select('#chart');
        
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
            selection.datum(data).call(chart);
        });
    });
    
    function setupDatepickers() {
        var dateFormat = "yy-mm-dd";
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
    }
});
