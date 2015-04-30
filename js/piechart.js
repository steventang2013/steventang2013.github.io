var width = 500;
var height = 500;
var margin = 200;
var radius = height/2;
var color = d3.scale.category10();
var data = [{"label":"C++", "value":15}, 
				  {"label":"C", "value":15}, 
				  {"label":"Python", "value":25},
				  {"label":"Java", "value":20},
				  {"label":"Javascript", "value":12},
				  {"label":"Rails", "value": 8},
				  {"label":"SQL", "value": 5}];

var visual = d3.select('#chart')
	.append("svg")
	.data([data])
	.attr("width", width + margin)
	.attr("height", height + margin)
	.append("g")
	.attr("transform", "translate(" + (radius + margin/2).toString() + "," + (radius + margin/2).toString() + ")");

update();

function update(){

	var pie = d3.layout.pie().value(function(d){return d.value;});
	// declare an arc generator function
	var arc = d3.svg.arc().outerRadius(radius);
	
	var sizeGenerator = true;
	
	// select paths, use arc generator to draw
	var arcs = visual.selectAll("g.slice").data(pie).enter().append("g").attr("class", "slice");
	arcs.append("path")
		.attr("fill", function(d, i){
			return color(i);
		})
		.attr("d", function (d) {
		
			return arc(d);
		})
		.on("mouseover", function(d){
			d3.select(this).style("stroke", "yellow");
			d3.select(this).style("stroke-width", "5px");
		})
		.on("mouseout", function(d){
			d3.select(this).style("stroke", null);
			d3.select(this).style("stroke-width", null);
		})
		.on("click", function(d, i){
			color = d3.scale.category20().range()[Math.floor(Math.random()*100%20)];
			d3.select(this).attr("fill", color);
		});

	// add the text
	arcs.append("text")
		.attr("font-family", "Arial")
		.attr("font-size", "15px")
		.attr("transform", function(d){
				d.innerRadius = 0;
				d.outerRadius = radius;
		return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
		return data[i].value + "%";}
		);
	
	arcs.append("text")
		.attr("transform", function(d) {
			var c = arc.centroid(d);
			var x = c[0];
			var y = c[1];
			var h = Math.sqrt(x*x + y*y);
			return "translate(" + (x/(h-30) * (radius - 40)) +  ',' +
				(y/(h-30) * (radius - 40)) +  ")"; 
		})
	.attr("dy", ".8em")
	.attr("font-size", "20px")
	.attr("text-anchor", function(d) {
		// are we past the center?
		return (d.endAngle + d.startAngle)/2 > Math.PI ?
			"end" : "start";
	})
	.text(function(d, i) { return data[i].label; });
}
