/* globals d3, moment */

function lineChart(config) {
    var marginTop =  20;
    var marginBottom = 20;
    var marginLeft = 40;
    var marginRight = 20;
    var plotHeight = 400;
    var plotWidth = 600;
    
    var getterSetter = function(field, value) {
        if (arguments.length === 1) return chart[field];
        chart[field] = value;
        return chart;
    }
    
    var x = function(d) {
        return moment(d.Date);
    }
    
    var y = function(d) {
        return d.High;
    }
    
    chart.marginTop = function(value) {
        return getterSetter('marginTop', value);
    }
    
    chart.marginBottom = function(value) {
        return getterSetter('marginBottom', value);
    }
    
    chart.marginLeft = function(value) {
        return getterSetter('marginLeft', value);
    }
    
    chart.marginRight = function(value) {
        return getterSetter('marginRight', value);
    }
    
    chart.plotHeight = function(value) {
        return getterSetter('plotHeight', value);
    }
    
    chart.plotWidth = function(value) {
        return getterSetter('plotWidth', value);
    }
    
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
                .domain([d3.min(data, function(d) { return moment(d.Date); }), d3.max(data, function(d) { return moment(d.Date); })])
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
    }
    
    return chart;
};