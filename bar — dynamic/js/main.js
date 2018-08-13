var margin = {
    left: 100,
    right: 10,
    bottom: 100,
    top: 40
};

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;


var whatToDisplay = {
    height: 'height',
    profit: 'profit'
};

var whatLabelYToDisplay = {
    height: 'Height',
    profit: 'Profit by Months',
}

var t = d3.transition().duration(750);

var currentDisplay = whatToDisplay.height;
var currentYLabel = whatLabelYToDisplay.height;

function displayItem(item) {

    checkTypeByTypeOf(item, 'string');
    checkIfPropertyExist(whatToDisplay, item);
    currentDisplay = item;
    checkIfPropertyExist(whatLabelYToDisplay, item);
    currentYLabel = whatLabelYToDisplay[item]
}

var data = d3.json('data/buildings.json').then(data => {

    data.forEach(d => {
        d.height = +d.height
        d.profit = +d.profit
    });

    var svg = d3.select('#chart-area')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 140)

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

    var x = d3.scaleBand()
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .range([height, 0])

    var xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)



    var yAxisGroup = g.append('g')
        .attr("class", "y-axis")


    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 120)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("The world's tallest buildings!")

    var yLabel = g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(currentYLabel);




    d3.interval(() => {

        var newData = currentDisplay === 'height' ? data : data.slice(1);
        update(newData);
        currentDisplay === 'height' ? displayItem(whatToDisplay.profit) : displayItem(whatToDisplay.height)
        
    }, 1000)


    const update = (data) => {

        x.domain(data.map(d => d.name))
        y.domain([0, d3.max(data, (d) => {
            return d[currentDisplay];
        })])

        var xAxisCall = d3.axisBottom(x);
        xAxisGroup.transition(t).call(xAxisCall)
            .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        var yAxisCall = d3.axisLeft(y)
            .ticks(4)
            .tickFormat((d) => d + "m");
        yAxisGroup.transition(t).call(yAxisCall);

        var rects = g.selectAll('rect')
            .data(data, (d) => d.name);

        // EXIT

        exitRects(rects);

        // UPDATE
        updateRects(rects);

        // ENTER 
        enterRects(rects);
    }

    update(data);



    function exitRects(rects) {
        rects
        .exit()
        .attr('fill', 'red')    
        .transition(t) 
        .attr('y', y(0))
        .attr('height', 0)
        .remove();
    }

    function updateRects(rects) {
        yLabel._groups[0][0].innerHTML = currentYLabel; // TODO: make it right


        rects.transition(t)
            .attr('y', (d) => y(d[currentDisplay]))
            .attr('x', (d) => x(d.name))
            .attr('width', x.bandwidth)
            .attr('height', (d) => height - y(d[currentDisplay]))
            .attr("fill", "grey");
    }

    function enterRects(rects) {
        yLabel._groups[0][0].innerHTML = currentYLabel; 

        rects
            .enter()
            .append('rect')
            .attr('y', (d) => y(0))
            .attr('width', x.bandwidth)
            .attr('x', (d) => x(d.name))
            .attr('height', 0)
            .attr("fill", "grey")
            .merge(rects)
        .transition(t)
        .attr('y', (d) => y(d[currentDisplay]))
        .attr('height', (d) => height - y(d[currentDisplay]))
    }
});



function checkTypeByTypeOf(variable, type) {
    if (typeof variable !== type) {
        throw new Error(`${type} is not commetable with ${variable}`);
    }
}

function checkTypeByInctanceOf(variable, type) {
    if (variable instanceof type !== true) {
        throw new Error(`${type} is not commetable with ${variable}`);
    }
}

function checkIfPropertyExist(obj, prop) {
    if (!obj.hasOwnProperty(prop)) {
        throw new Error(`${prop} is not Exits in ${obj}`);
    }
}