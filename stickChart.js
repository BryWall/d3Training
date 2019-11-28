//1. data
const sample = [{
  language: 'Rust',
  value: 78.9,
  color: '#000000'
},
{
  language: 'Kotlin',
  value: 75.1,
  color: '#00a2ee'
},
{
  language: 'Python',
  value: 68.0,
  color: '#fbcb39'
},
{
  language: 'TypeScript',
  value: 67.0,
  color: '#007bc8'
},
{
  language: 'Go',
  value: 65.6,
  color: '#65cedb'
},
{
  language: 'Swift',
  value: 65.1,
  color: '#ff6e52'
},
{
  language: 'JavaScript',
  value: 61.9,
  color: '#f9de3f'
},
{
  language: 'C#',
  value: 60.4,
  color: '#5d2f8e'
},
{
  language: 'F#',
  value: 59.6,
  color: '#008fc9'
},
{
  language: 'Clojure',
  value: 59.6,
  color: '#507dca'
}
];




// 2. Use the margin convention practice 
const margin = 100;
const width = window.innerWidth - 2 * margin // Use the window's width 
const height = window.innerHeight - 2 * margin; // Use the window's height

const n = sample.length;

// 5. X scale will use the index of our data
const xScale = d3.scaleBand()
  .domain(sample.map( d => d.language ))
  .range([0, width])
  .padding(0.1);
  

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
  .domain([0, 100]) // input 
  .range([height, 0]); // output 


// 1. Add the SVG to the page and employ #2
var svg = d3.select("#chartContainer")
  .attr("width", width + 2 * margin)
  .attr("height", height + 2 * margin)

const chart = svg
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")");


// 3. Call the x axis in a group tag
chart.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));
   // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
chart.append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft



svg.append('text')
  .attr('class', 'label')
  .attr('x', -(height / 2) - margin)
  .attr('y', margin / 2.4)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Love meter (%)')
 
svg.append('text')
  .attr('class', 'label')
  .attr('x', width / 2 + margin)
  .attr('y', height + margin * 1.7)
  .text('Languages')
 
svg.append('text')
  .attr('class', 'title')
  .attr('x', width / 2 + margin)
  .attr('y', 40)
  .text('Most loved programming languages in 2018')
 
svg.append('text')
  .attr('class', 'source')
  .attr('x', width - margin / 2)
  .attr('y', height + margin * 1.7)
  .attr('text-anchor', 'start')
  .text('Source: Stack Overflow, 2018')

chart.selectAll("y axis")
  .data(yScale.ticks()).enter()
  .append("line")
  .attr("class", "horizontalGrid")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", d => yScale(d))
  .attr("y2", d => yScale(d))
  .attr("stroke","#fff");
  

  const barGroup = chart.selectAll(".bar")
  .data(sample).enter()
  .append('g')
  .attr('class', 'barContainer');

  barGroup
  .append("rect") // Uses the enter().append() method
  .attr("class", "bar") // Assign a class for styling
  .transition()
  .duration(300)
  .delay((_, i) => i * 70)
  .attr("x", d => xScale(d.language))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.value))
  .attr("fill", (d,i) => `rgb(${i*20}, ${Math.round(i*20/2)},200)`);


barGroup.
  on("mouseenter", (actual) => {
    const x = xScale(actual.language);
    const y = yScale(actual.value);
    chart.append("text")
      .attr("id", "current")
      .attr("text-anchor", "middle")
      .attr("x", x + 60)
      .attr("y", y + 20)
      .text(`${actual.language} : ${actual.value}`);
    const limit = chart.append('g')
      .attr('id', 'limit');

    limit.append("rect")
      .attr("id", "currentRect")
      .attr("width", 40)
      .attr("height", 30)
      .attr("x", -40)
      .attr("y", y - 15)
      .attr("fill", actual.color);

    limit.append("text")
      .attr("text-anchor", "middle")
      .attr("id","currentValue")
      .attr("x", -20)
      .attr("y", y + 5)
      .attr("fill", "#000")
      .text(actual.value);
    limit.append('line')
      .attr('x1',0)
      .attr('x2', width)
      .attr('y1', y)
      .attr('y2', y)
      .attr('stroke', actual.color)
      .attr('id','linevalue');
    d3.select("#chartContainer g").selectAll('.diffValue')
      .data(sample).enter()
      .append("text")
      .attr("class", "diffValue")
      .attr("text-anchor", "middle")
      .attr("y", d => yScale(d.value) + 20 )
      .attr("x", d => xScale(d.language)+ 60)
      .text(d => {if(d != actual){
        if(d.value>actual.value)
          return `+ ${(d.value - actual.value).toFixed(1)} %`;
        return `${(d.value - actual.value).toFixed(1)} %`;
      } 
        });
    
      

  })
  .on("mouseleave", (actual, i) => {
    d3.select("#current").remove();
    d3.select("#currentValue").remove();
    d3.select("#limit").remove();
    d3.select("#chartContainer g").selectAll('.diffValue').remove();
    chart.selectAll("#linevalue").remove();
  })
