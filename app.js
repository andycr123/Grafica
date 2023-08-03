// URL for the GDP data JSON file
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

// XMLHttpRequest object to fetch data from the URL
let req = new XMLHttpRequest();

// Variables to hold data and scales
let data;
let values = [];
let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

// Dimensions and padding for the chart
let width = 1000;
let height = 600;
let padding = 40;

// Select the SVG element using D3.js
let svg = d3.select('svg');

// Function to draw the canvas (SVG) with specified width and height
let drawCanvas = () => {
    svg.attr('width', width)
        .attr('height', height);
};

// Function to generate scales for x and y axes
let generateScales = () => {
    // Create a scale for the height of the bars
    heightScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => item[1])])
        .range([0, height - (2 * padding)]);

    // Create a scale for the x-axis (based on the number of data points)
    xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding]);

    // Create an array of dates and create a time scale for the x-axis
    let datesArray = values.map((item) => new Date(item[0]));
    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding]);

    // Create a scale for the y-axis
    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => item[1])])
        .range([height - padding, padding]);
};

// Function to draw the bars on the chart
let drawBars = () => {
    // Create a tooltip element
    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto');

    // Bind data to rectangles and draw the bars
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('data-date', (item) => item[0])
        .attr('data-gdp', (item) => item[1])
        .attr('height', (item) => heightScale(item[1]))
        .attr('x', (item, index) => xScale(index))
        .attr('y', (item) => height - padding - heightScale(item[1]))
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible');

            tooltip.text(item[0]);

            // Set 'data-date' attribute of tooltip div
            document.querySelector('#tooltip').setAttribute('data-date', item[0]);
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden');
        });
};

// Function to generate x and y axes
let generateAxes = () => {
    // Create x and y axis generators
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    // Append x-axis to the SVG and translate to the bottom
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`);

    // Append y-axis to the SVG and translate to the left
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`);
};

// Make an HTTP GET request to fetch the JSON data
req.open('GET', url, true);
req.onload = () => {
    // Parse the JSON data and store it in 'data' variable
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values);

    // Call the functions to draw the chart
    drawCanvas();
    generateScales();
    drawBars();
    generateAxes();
};
req.send();