/* globals d3, $ */

function pieChart() {
    var marginTop =  20;
    var marginBottom = 20;
    var marginLeft = 20;
    var marginRight = 20;
    var plotHeight = 400;
    var plotWidth = 600;
    var onMouseOver = function(data) {};
    var onMouseOut = function(data) {};
    
    chart.setMouseActions = function(_onMouseOver, _onMouseOut) {
        onMouseOver = _onMouseOver;
        onMouseOut = _onMouseOut;
        return chart;
    };
    
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
    
    function chart(selection) {
        selection.each(function(data) {
            
            // Create the svg element if it doesn't exist
            var svg = d3.select(this).selectAll("svg").data([data])
                .enter()
                .append("svg")
                .attr("width", plotWidth + marginLeft + marginRight)
                .attr("height", plotHeight + marginTop + marginBottom);
            
            // Create the chart area
            var chart = svg.data([data])
                .append("g")
                .attr("width", plotWidth)
                .attr("height", plotHeight)
                .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");
                
            // Centered at pie origin
            var group = chart.append("g")
                .attr("transform", "translate(" + (plotWidth / 2) + "," + (plotHeight / 2) + ")");
            
            // Color scale
            var color = d3.scale.category10();
            
            // Radius
            var outerRadius = Math.min(plotWidth, plotHeight) / 2; 
            var innerRadius = Math.min(plotWidth, plotHeight) / 4; 
            
            // Function for drawing the arc
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
                
            // Function for calculating the start and end angles of the arcs
            var pie = d3.layout.pie()
                .value(function(d) { return d.value; });
            
            var path = group.selectAll('path')
                .data(pie(data))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function(d, i) { return color(i); })
                .on("mouseover", function(d) {
                    onMouseOver(d.data);
                })
                .on("mouseout", function(d) {
                    onMouseOut(d.data);
                });
        });
    }
    
    return chart;
}

$(function() {
    
    var data = [
        {name: "Chrome", value: 61.9}, 
        {name: "Firefox", value: 23.4}, 
        {name: "IE", value: 7.8}, 
        {name: "Safari", value: 3.8}, 
        {name: "Opera", value: 1.6}
    ];
    
    var chart = pieChart()
        .setMouseActions(function(data) {
            $('#name').text(data.name);
            $('#value').text(data.value);
        }, function(data) {
            $('#name').text("");
            $('#value').text("");
        });
    var selection = d3.select('#chart');
    
    selection.datum(data)
        .call(chart);
});