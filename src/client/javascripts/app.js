/* globals d3, moment, $ */

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