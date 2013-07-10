function Link(source, target) {
	this.source = source;
	this.target = target;
}

var links = [];

// get the data
//d3.csv("force.csv", function(error, links) {
links.push(new Link('Facebook', 'Google'));
links.push(new Link('Buzzfeed', 'Reddit'));
links.push(new Link('Pinterest', 'Reddit'));
links.push(new Link('Imgur', 'Reddit'));
links.push(new Link('Google', 'Reddit'));
links.push(new Link('Twitter', 'Reddit'));
links.push(new Link('Google', 'Google Images'));
links.push(new Link('Reddit', 'Google'));
links.push(new Link('Buzzfeed', 'Twitter'));
links.push(new Link('Instagram', 'Twitter'));
links.push(new Link('Tumblr', 'Twitter'));
links.push(new Link('Facebook', 'Instagram'));
links.push(new Link('Twitter', 'Instagram'));
links.push(new Link('Reddit', 'Imgur'));
links.push(new Link('LiveMeme', 'Imgur'));
links.push(new Link('Reddit', 'Pinterest'));
links.push(new Link('Facebook', 'Pinterest'));
links.push(new Link('Pinterest', 'Facebook'));
links.push(new Link('DegreeWorks', 'Buzzport'));
links.push(new Link('Tsquare', 'Buzzport'));
links.push(new Link('Twitter', 'Buzzfeed'));
links.push(new Link('Reddit', 'Buzzfeed'));
links.push(new Link('Twitter', 'Tumblr'));
links.push(new Link('Imgur', 'LiveMeme'));


var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] || 
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
    link.value = +link.value;
});

var width = 700,
    height = 400;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(170)
    .charge(-500)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height + 300);

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
    .attr("r", 5);

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
