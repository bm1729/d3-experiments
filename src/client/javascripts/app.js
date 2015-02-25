/* globals d3, $ */

$(function() {
    
    var data = [
      {name: "Locke",    value:  1},
      {name: "Reyes",    value:  2},
      {name: "Ford",     value: 3},
      {name: "Jarrah",   value: 4},
      {name: "Shephard", value: 5},
      {name: "Kwon",     value: 6}
    ];
    
    $('#change').click(function() {
        $.each(data, function(index, datum) {
            datum.value = 1 + Math.floor(Math.random() * 6);
        });
        d3.selectAll("rect").transition()
            .duration(2000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });
        d3.selectAll("g text").transition()
            .duration(2000)
            .attr("y", function(d) { return y(d.value) + 3 });
    });
        
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
        
    var chart = d3.select(".chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
    var y = d3.scale.linear()
        .domain([0, 6])
        .range([height, 0]);
            
    var yAxis = d3.svg.axis()
        .scale(y);
    
    var barWidth = width / data.length;
    
    var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
    
    bar.append("rect")
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", barWidth - 1);
    
    bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.value) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.name; });
        
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "rotate(90)")
        .call(yAxis);
});