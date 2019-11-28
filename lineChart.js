// 2. Use the margin convention practice 
const margin = 100;
const width = window.innerWidth - 2 * margin // Use the window's width 
const height = window.innerHeight - 2 * margin; // Use the window's height

const n = 15;

// 5. X scale will use the index of our data
const xScale = d3.scaleLinear()
  .domain([0, n - 1]) // input
  .range([0, width]); // output

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
  .domain([0, 100]) // input 
  .range([height, 0]); // output 

// 7. d3's line generator
var line = d3.line()
  .x(function (d, i) {
    return xScale(i);
  }) // set the x values for the line generator
  .y(function (d) {
    return yScale(d);
  }) // set the y values for the line generator 
  .curve(d3.curveLinear) // apply smoothing to the line

// // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var dataset = d3.range(n).map((d) => Number.parseInt(d3.randomUniform(0, 100)()))


// 1. Add the SVG to the page and employ #2
var svg = d3.select("#chartContainer")
  .attr("width", width + 2 * margin)
  .attr("height", height + 2 * margin)
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")");

// 3. Call the x axis in a group tag
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

svg.selectAll("y axis")
  .data(yScale.ticks()).enter()
  .append("line")
  .attr("class", "horizontalGrid")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", d => yScale(d))
  .attr("y2", d => yScale(d));

svg.selectAll("x axis").data(xScale.ticks()).enter()
  .append("line")
  .attr("class", "verticalGrid")
  .attr("y1", 0)
  .attr("y2", height)
  .attr("x1", d => xScale(d))
  .attr("x2", d => xScale(d));

// 9. Append the path, bind the data, and call the line generator 
svg.append("path")
  .datum(dataset) // 10. Binds data to the line 
  .attr("class", "line") // Assign a class for styling 
  .attr("d", line); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
const dotsGroup = svg.selectAll(".dot")
  .data(dataset).enter()
  .append("circle") // Uses the enter().append() method
  .attr("class", "dot") // Assign a class for styling
  .attr("cx", function (d, i) {
    return xScale(i)
  })
  .attr("cy", function (d) {
    return yScale(d)
  })
  .attr("r", 20)

dotsGroup
  .on("mouseenter", (actual, i) => {
    const x = xScale(i);
    const y = yScale(actual);
    svg.append("text")
      .attr("id", "current")
      .attr("text-anchor", "middle")
      .attr("x", x)
      .attr("y", y + 40)
      .attr("fill", "#fff")
      .text(actual)
    d3.select("#chartContainer g").selectAll('.diffValue')
      .data(dataset).enter()
      .append("text")
      .attr("class", "diffValue")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("y", d => yScale(d) - 40)
      .attr("x", (d, i) => xScale(i))
      .text(d => d - actual);
  })

  .on("mouseleave", (actual, i) => {
    d3.select("#current").remove();
    d3.select("#chartContainer g").selectAll('.diffValue').remove();
  })


d3.select("body").select("svg").on('mousemove', function (coord) {
  const [x, y] = d3.mouse(this);
  d3.selectAll(".cross").remove();
  svg.append('line')
    .attr('x1', 0)
    .attr('y1', y - margin)
    .attr('x2', width)
    .attr('y2', y - margin)
    .attr('class', 'cross');
  svg.append('line')
    .attr('x1', x - margin)
    .attr('y1', 0)
    .attr('x2', x - margin)
    .attr('y2', height)
    .attr('class', 'cross');
})




