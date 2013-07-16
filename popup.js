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
	if (link.source.search("newtab") == 0) {
		nodes[link.target] = {name: link.target};
	} else {
		links.push(link);
	}
});

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] || 
        (nodes[link.source] = {name: link.source, radius: numberOfCookies(link.cookie)});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target, radius: numberOfCookies(link.cookie)});
});

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .linkDistance(100)
    .charge(-500)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg");

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
    .attr("r", function (d) { return d.radius * 5 || 5; });

// add the text 
node.append("text")
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
