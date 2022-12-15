// set the dimensions and margins of the graph
const margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", 900)
    .attr("height", 600)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("wide.csv").then( function(data) {
    // List of groups 
    const allGroup = ["Endeavor Airlines", "American Airlines", "Alaska Airlines", "Jetblue Airlines", "Delta Airlines", "ExpressJet Airlines", "Frontier Airlines", "Allegiant Airlines", "Hawaiian Airlines", "Envoy Airlines", "Spirit Airlines", "PSA Airlines", "SkyWest Airlines", "Horizon Airlines", "United Airlines", "Virgin America Airlines", "Southwest Airlines", "Mesa Airlines", "Republic Airlines"]
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })
    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);
    // Add X axis --> it is a date format
    const month = [{month: "Jan"}, {month: "Feb"}, {month: "Mar"}, {month: "Apr"}, {month: "May"}, {month: "Jun"},
                 {month: "Jul"}, {month: "Aug"}, {month: "Sep"}, {month: "Oct"}, {month: "Nov"}, {month: "Dec"}]
    const x = d3.scaleBand()
      .domain(month.map(d => d.month))
      .range([0, width])
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    // Add Y axis
    const y = d3.scaleLinear()
      .domain( [-15,30])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average Delay Time");
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Month");
    svg.append("text")
    .attr("class", "title")
    .attr("text-anchor", "end")
    .style("font", "24px times")
    .attr("x", 680)
    .attr("y", 12)
    .text("Monthly Change of Delay Time for Different Airlines");
    // Initialize line with group a
    const line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(d.month) + 30 })
          .y(function(d) { return y(+d['American Airlines']) })
        )
        .attr("stroke", function(d){ return myColor("American Airlines") })
        .style("stroke-width", 10)
        .style("fill", "none")
        .on("mouseover", function() {
         svg.append("text")
         .attr("id", "info")
         .attr("x", 400)
         .attr("y", 100)
         .text('rank: '+d3.min(data.map(function(d){return d[d3.select("#selectButton").node().value.toString()+' Rank']} )).toString()+' average delay time (minutes): ' + d3.min(data.map(function(d){return d[d3.select("#selectButton").node().value.toString()+' Delay']} )).toString());
         })
         .on("mouseout", function() {
         svg.select("#info").remove();
         });
    // A function that update the chart
    function update(selectedGroup) {
      // Create new data with the selection?
      const dataFilter = data.map(function(d){return {month:d.month, value:d[selectedGroup], rank:d[selectedGroup+' Rank']} })
      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.month) + 30 })
            .y(function(d) { return y(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})
