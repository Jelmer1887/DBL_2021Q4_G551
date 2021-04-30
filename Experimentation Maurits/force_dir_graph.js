var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

async function getData(){
  const response = await fetch("./enron-v1.csv");
  const data = await response.text();
  //console.log(data);
  return data
}

async function parseData(dataText) {
    var data = d3.csvParseRows(await dataText);
    //console.log(data[1][1]);
    return data
}

async function makeLinks(someData) {
    var d = await someData;
    var links = [];
    for(i = 1; i<d.length; i++) {
        links.push({source: parseInt(d[i][1]), target: parseInt(d[i][4])});
    }
    //console.log(links);
    return links;
}

async function makeNodes(l){
    var links = await l;
    var nodes = [];
    links.forEach(function(link) {
        //For each source ID, add it to the nodes, no duplicates
        link.source = nodes[link.source] || 
        (nodes[link.fromEmail] = {id: link.source}); 
    //For each target ID, add it to the nodes, no duplicates
        link.target = nodes[link.target] ||
        (nodes[link.target] = {id: link.target})
    });
    //console.log(nodes); //shows undefined: {id:92} but still displays this id as intended in array. 92 occurs twice, where the person sent themselves an email.
    return nodes;
}

var linksArray = new Array();
var nodesArray = new Array();

async function makeData() {
  linksArray = await makeLinks(parseData(getData()));
  nodesArray = await makeNodes(makeLinks(parseData(getData())));
    return [linksArray, nodesArray];
}

var simulation = d3
    .forceSimulation(makeData()[1])
    .force("link", d3.forceLink(makeData()[0]))
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(width/2, height/2))
    .on("tick", ticked);


//tells how to draw a node
var node = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodesArray)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("fill", function(d) {
    return "red";
  })

//tells how to draw an edge
var link = svg
  .append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(linksArray)
  .enter()
  .append("line")
  .attr("stroke-width", function(d) {
    return 3;
  }); 
//what the simulation does on a tick
function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
      //console.log("tick bro");
}




