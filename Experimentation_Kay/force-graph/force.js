const width = 500;
const height = 500;

function runSimulation(links, nodes) {
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("g").remove();

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 2)
        .attr("fill", "#ff0000")
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

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


function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

var nodes = [
    { "id": 0 },
    { "id": 1 },
    { "id": 2 },
    { "id": 3 },
    { "id": 4 },
    { "id": 5 },
];

var links = [
    { "source": 0, "target": 1 },
    { "source": 0, "target": 5 },
    { "source": 2, "target": 1 },
    { "source": 3, "target": 5 },
    { "source": 2, "target": 4 },
]

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

        // Loop through all the lines, but skip the first since that one never contains data.
        for (var line = 1; line < lines.length; line++) {
            // Get the different columns by splitting on the "," .
            var columns = lines[line].split(',');

            // Make sure it's not an empty line.
            if (columns.length <= 4) {
                continue;
            }

            // Filter to a specific month for performance and clarity.
            if (!columns[0].includes("2001-12")) {
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
                }
            }
            if (!srcFound) {
                nodes.push({ "id": source });
            }

            // Add the target if we can't find it in the array of nodes.
            var tarFound = false;
            for (var n of nodes) {
                if (n.id === target) {
                    tarFound = true;
                }
            }
            if (!tarFound) {
                nodes.push({ "id": target });
            }

            // Create the link between the source and target
            links.push({ "source": source, "target": target });
        }

        // Start the simulation with the new links and nodes.
        runSimulation(links, nodes);
    };

    reader.readAsText(file);
};