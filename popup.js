document.getElementById('reset').onclick = function() {
	localStorage.clear();
  $('svg').remove();
	chrome.runtime.sendMessage({reset: true}, function(response) {});    
	document.getElementById("reset-message").style.display = 'block';
	document.getElementById("show-google").style.display = 'none';
    document.getElementById("show-bubble").style.display = 'none';
	document.getElementById("show-normal").style.display = 'none';
	document.getElementById("reset").style.display = 'none';
}

document.getElementById('close').onclick = function() { window.close(); };

function numberOfCookies(cookieString) {
	var num = 0;
	var n = cookieString.search("_ga");
	if (n > -1) {
		num++;
	} 
	n = cookieString.search("__utma");
	if (n > -1) {
		num++;
	} 
	n = cookieString.search("__utmb");
	if (n > -1) {
		num++;
	} 
	n = cookieString.search("__utmc");
	if (n > -1) {
		num++;
	} 
	n = cookieString.search("__utmz");
	if (n > -1) {
		num++;
	} 
	n = cookieString.search("__utmv");
	if (n > -1) {
		num++;
	} 

	return num;
}

var links = [];
var nodes = {};

JSON.parse(String(localStorage.siteList)).forEach(function(link) {
	if (link.source.search("newtab") == 0 || link.source == "") {
		nodes[link.target] = {name: link.target};
	} else {
		links.push(link);
	}
});

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] || 
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
});

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(100)
    .charge(-500)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
	.attr("width", width + 80)
    .attr("height", height + 400)
    .attr("pointer-events", "all")
    .attr("id","all");

// build the arrow.
svg.append("svg").append("defs").selectAll("marker")
    .data(["end"])
  .enter().append("svg:marker")
    .attr("id", String)
		.attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg").append("path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path = svg.append("svg").append("g").selectAll("path")
    .data(force.links())
  .enter().append("svg").append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    
.attr("class", "node")
    .call(force.drag);

// add the nodes
node.append("circle")
    .attr("r", function (d) { return 5; });

// add the text 
node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

var links2 = [];
var nodes2 = {};

JSON.parse(String(localStorage.siteList)).forEach(function(link) {
	if (numberOfCookies(link.cookie) > 0) {
		if (link.source.search("newtab") == 0 ) {
			nodes2[link.target] = {name: link.target};
		} else {
			links2.push(link);
		}
	}
});

// Compute the distinct nodes from the links.
links2.forEach(function(link) {
    link.source = nodes2[link.source] || 
        (nodes2[link.source] = {name: link.source, radius: numberOfCookies(link.cookie)});
    link.target = nodes2[link.target] ||
        (nodes2[link.target] = {name: link.target, radius: numberOfCookies(link.cookie)});
});

var width2 = 960,
    height2 = 500;

var force2 = d3.layout.force()
    .nodes(d3.values(nodes2))
    .links(links2)
    .size([width2, height2])
    .linkDistance(100)
    .charge(-500)
    .on("tick", tick)
    .start();

var svg2 = d3.select("body").append("svg")
	.attr("width", width2 + 80)
    .attr("height", height2 + 400)
    .attr("pointer-events", "all")
    .attr("id","google");

// build the arrow.
svg2.append("svg").append("defs").selectAll("marker")
    .data(["end"])
  .enter().append("svg:marker")
    .attr("id", String)
		.attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg").append("path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path2 = svg2.append("svg").append("g").selectAll("path")
    .data(force2.links())
  .enter().append("svg").append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

// define the nodes
var node2 = svg2.selectAll(".node")
    .data(force2.nodes())
  .enter().append("g")
    
.attr("class", "node")
    .call(force2.drag);

// add the nodes
node2.append("circle")
    .attr("r", function (d) { return d.radius * 5; });

// add the text 
node2.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });


// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," +  
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," + 
            d.target.y;
    });

    node
        .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; });
};

document.getElementById('show-google').onclick = function() {
	document.getElementById("google").style.display = 'block';
	document.getElementById("show-google").style.display = 'none';
	document.getElementById("all").style.display = 'none';
	document.getElementById("show-normal").style.display = 'block';
    document.getElementById("show-bubble").style.display = 'block';

}

document.getElementById('show-bubble').onclick = function() {
	document.getElementById("google").style.display = 'block';
	document.getElementById("show-google").style.display = 'block';
	document.getElementById("all").style.display = 'none';
	document.getElementById("show-normal").style.display = 'block';
}

document.getElementById('show-normal').onclick = function normalSettings() {
	document.getElementById("google").style.display = 'none';
	document.getElementById("show-google").style.display = 'block';
	document.getElementById("all").style.display = 'block';
	document.getElementById("show-normal").style.display = 'none';
    document.getElementById("show-bubble").style.display = 'block';

}

document.getElementById("google").style.display = 'none';
document.getElementById("show-normal").style.display = 'none';
