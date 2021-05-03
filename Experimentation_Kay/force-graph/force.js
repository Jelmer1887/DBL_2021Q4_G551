//dimensions of the svg 
const width = 1000;  
const height = 1000;

//TODO: Make behaviour of forceSimulation intuitive and user friendly (experiment with parameters). 
function runSimulation(links, nodes) {
    const simulation = d3.forceSimulation(nodes) //automatically runs simulation 
        .force("link", d3.forceLink(links).id(d => d.id)) //Adds forces between nodes, depending on if they're linked
        .force("charge", d3.forceManyBody()) // nodes repel each other
        .force("center", d3.forceCenter(width / 2, height / 2)); // nodes get pulled towards the centre of svg 

    const svg = d3.select("svg") //let d3 know where the simulation takes place
        .attr("viewBox", [0, 0, width, height]); //gives it dimensions

    svg.selectAll("g").remove();

    //adds visuals of the links
    const link = svg.append("g")  //"g" is an element of SVG used to group other SVG elements
        .attr("stroke-opacity", 0.6) 
        .selectAll("line")
        .data(links)
        .join("line") 
        .attr("stroke-width", d => Math.min(Math.sqrt(d.value), 8))
        .attr("stroke", d => linkColor(d.sentiment));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 2)
        .attr("fill", d => nodeColor(d.job)) //colour nodes depending on job title 
        .call(drag(simulation)); //makes sure you can drag nodes

    node.append("title")
        .text(d => d.id); //gives each node element in the svg a title (its id). Visible when hovering over node.

    //function that updates position of nodes and links
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

function linkColor(sentiment) {
    /*
    var sum = 0;
    for (var s of sentiment) {
        sum += s;
    }
    
    var average = sum / sentiment.length;
    if (average > 0.1) {
        return "#55EE55";
    }
    if (average < -0.1) {
        return "#EE5555";
    }
    
    return "#999999";
    */
    //link colour based on sentiment of message
    for (var s of sentiment) {
        if (s > 0.1) {
            return "#55EE55";
        }

        if (s < -0.1) {
            return "#EE5555";
        }
    }

    return "#999999";
}

//node colour based on job title
function nodeColor(job) {
    switch (job) {
        case "Employee":
            return "#0000FF";
        case "Vice President":
            return "#00FF00";
        case "Manager":
            return "#00FFFF";
        case "In House Lawyer":
            return "#FFFF00";
        case "Trader":
            return "#FF00FF";
        case "Director":
            return "#0808FF";
        case "Managing Director":
            return "#0404FF";
        case "President":
            return "#FF0707";
        case "CEO":
            return "#FF0000"
        case "Unknown":
            return "#555555";

        default:
            console.log(job);
            return "#000000";
    }
}

//to drag nodes around
//for a better understanding of alphaTarget (and alphaMin) check API or https://stackoverflow.com/questions/46426072/what-is-the-difference-between-alphatarget-and-alphamin
function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.2).restart(); //alphaTarget indicates how eager the nodes are to move. Changing this parameter changes behaviour of graph!!!
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) { //if node is being dragged, update position of node
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) { 
        if (!event.active) simulation.alphaTarget(0); //drag has ended, the simulation stops moving  (alphaTarget(0))
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

var nodes = [
    { "id": 0, "job": "Employee" },
    { "id": 1, "job": "Unknown" },
    { "id": 2, "job": "Employee" },
    { "id": 3, "job": "Employee" },
    { "id": 4, "job": "Vice President" },
    { "id": 5, "job": "Manager" },
];

var links = [
    { "source": 0, "target": 1, "value": 1, "sentiment": [0.0] },
    { "source": 0, "target": 5, "value": 1, "sentiment": [0.4] },
    { "source": 2, "target": 1, "value": 1, "sentiment": [0.9] },
    { "source": 3, "target": 5, "value": 1, "sentiment": [-0.5] },
    { "source": 2, "target": 4, "value": 1, "sentiment": [-0.8] },
]

// The month and year we want to look at. Add slider for multiple time frames. 
var year = 2001;
var month = 12;

runSimulation(links, nodes);

document.getElementById('file').onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();

    reader.onload = function (progressEvent) {

        // Array of strings with every string being a line.
        var lines = this.result.split('\n');

        // Empty the nodes and links so we can read the new ones.
        nodes = [];
        links = [];

        var filter = year + "-" + month;

        // Loop through all the lines, but skip the first since that one never contains data.
        for (var line of lines) {
            // Get the different columns by splitting on the "," .
            var columns = line.split(',');

            // Make sure it's not an empty line.
            if (columns.length <= 4) {
                continue;
            }

            // Filter to a specific month for more clarity.
            if (!columns[0].includes(filter)) {
                continue;
            }

            // Convert the source and target to an integer.
            var source = parseInt(columns[1]);
            var target = parseInt(columns[4]);

            // Add the source if we can't find it in the array of nodes.
            var srcFound = false;
            for (var n of nodes) {
                if (n.id === source) {
                    srcFound = true;
                    break;
                }
            }
            if (!srcFound) {
                nodes.push({ "id": source, "job": columns[3] });
            }

            // Add the target if we can't find it in the array of nodes.
            var tarFound = false;
            for (var n of nodes) {
                if (n.id === target) {
                    tarFound = true;
                    break;
                }
            }
            if (!tarFound) {
                nodes.push({ "id": target, "job": columns[6] });
            }

            // Create the link between the source and target
            var linkFound = false;
            for (var l of links) {
                if ((l.source === source && l.target === target) ||
                    (l.source === target && l.target === source)) {
                    linkFound = true;
                    l.value += 1;
                    l.sentiment.push(columns[8]);
                    break;
                }
            }
            if (!linkFound) {
                links.push({ "source": source, "target": target, "value": 1, "sentiment": [columns[8]] });
            }
        }

        // Start the simulation with the new links and nodes.
        runSimulation(links, nodes);
    };

    reader.readAsText(file);
};