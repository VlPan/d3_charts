/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

var margin = {
	left: 100,
	right: 10,
	bottom: 100,
	top: 40
};

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var t = d3.transition().duration(750);

d3.json("data/data.json").then(function (data) {
	var dataFirstEl = data[0].countries;
	dataFirstEl.forEach(d => {
		d.income = +d.income;
		d.lifeExp = +d.life_exp;
		d.population = +d.population;

		delete d.life_exp;
	});

	currentData = dataFirstEl;
	

	var svg = d3.select("#chart-area")
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom + 120)

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	// X
	var x = d3.scaleLinear()
		.range([0, width]);
	var y = d3.scaleLinear()
		.range([height, 0]);

	var xAxisGroup = g.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(0, ${height})`)

	var yAxisGroup = g.append('g')
		.attr("class", "y-axis")


	var xLabel = g.append("text")
		.attr("class", "x axis-label")
		.attr("x", width / 2)
		.attr("y", height + 120)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Income ($)")

	var yLabel = g.append("text")
		.attr("class", "y axis-label")
		.attr("x", -(height / 2))
		.attr("y", -60)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Life Exp (Years)");

	// UPDATE 

	x.domain([0, 50000]);
	y.domain([0, 90]);

	var xAxisCall = d3.axisBottom(x)
		.ticks(4)
		.tickFormat((d) => "$" + d);
	xAxisGroup.transition(t).call(xAxisCall)
		.selectAll("text")
		.attr("text-anchor", "center")


	var yAxisCall = d3.axisLeft(y);

	yAxisGroup.transition(t).call(yAxisCall);

	var rects = g.selectAll('circle')
		.data(currentData, (d) => {
			d.income,
				d.lifeExp,
				d.population
		});

	enterRects(rects);

	function enterRects(rects) {

		rects
			.enter()
			.append('circle')
			.attr('cy', (d) => {
				return y(0)
			})
			.attr('r', (d) => ((d.population / 10000000) < 2 ? 2 : (d.population / 10000000)))
			.attr('cx', (d, index) => x(d.income) || 0)
			.attr("fill", (d) => getRandomColor())
			.merge(rects)
			.transition(t)
			.attr('cy', (d) => y(d.lifeExp || 0))
			.attr('cx', (d, index) => x(d.income) || 0)
	}
})



function getRandomColor() {
	r = Math.random() * 10;
	r = Math.floor(r);
	console.log(r);
	switch (r) {
		case 0:
			return 'grey'
		case 1:
			return 'violet'
		case 2:
			return 'greenyellow'
		case 3:
			return 'green'
		case 4:
			return 'blanchedalmond'
		case 5:
			return 'lawngreen'
		case 6:
			return 'lightcoral'
		case 7:
			return 'blueviolet'
		case 8:
			return 'khaki'
		case 9:
			return 'tan'
		case 10:
			return 'teal'
	}
}


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