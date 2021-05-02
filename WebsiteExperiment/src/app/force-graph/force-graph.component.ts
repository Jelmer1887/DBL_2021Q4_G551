import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-force-graph',
    templateUrl: './force-graph.component.html',
    styles: [
    ]
})
export class ForceGraphComponent implements OnInit, OnChanges {

    @Input() file;

    private nodes = [
        { "id": 0, "job": "Employee" },
        { "id": 1, "job": "Unknown" },
        { "id": 2, "job": "Employee" },
        { "id": 3, "job": "Employee" },
        { "id": 4, "job": "Vice President" },
        { "id": 5, "job": "Manager" },
    ];

    private links = [
        { "source": 0, "target": 1, "value": 1, "sentiment": [0.0] },
        { "source": 0, "target": 5, "value": 1, "sentiment": [0.4] },
        { "source": 2, "target": 1, "value": 1, "sentiment": [0.9] },
        { "source": 3, "target": 5, "value": 1, "sentiment": [-0.5] },
        { "source": 2, "target": 4, "value": 1, "sentiment": [-0.8] },
    ]

    private width = 1000;
    private height = 1000;

    private year = 2001;
    private month = 12;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        let fileReader = new FileReader();

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines = fileReader.result.toString().split('\n');

            // Empty the nodes and links so we can read the new ones.
            this.nodes = [];
            this.links = [];

            var filter = this.year + "-" + this.month;

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
                for (var n of this.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        break;
                    }
                }
                if (!srcFound) {
                    this.nodes.push({ "id": source, "job": columns[3] });
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of this.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        break;
                    }
                }
                if (!tarFound) {
                    this.nodes.push({ "id": target, "job": columns[6] });
                }

                // Create the link between the source and target
                var linkFound = false;
                for (var l of this.links) {
                    if ((l.source === source && l.target === target) ||
                        (l.source === target && l.target === source)) {
                        linkFound = true;
                        l.value += 1;
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }
                }
                if (!linkFound) {
                    this.links.push({
                        "source": source,
                        "target": target,
                        "value": 1,
                        "sentiment": [parseFloat(columns[8])]
                    });
                }
            }

            // Start the simulation with the new links and nodes.
            this.runSimulation(this.links, this.nodes);
        };

        if (this.file != null) {
            fileReader.readAsText(this.file);
        }
    }

    runSimulation(links, nodes): void {
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        const svg = d3.select("#force-graph")
            .attr("width", this.width)
            .attr("height", this.height);

        svg.selectAll("g").remove();

        const link = svg.append("g")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", (d: any) => Math.min(Math.sqrt(d.value), 8))
            .attr("stroke", (d: any) => this.linkColor(d.sentiment));

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 2)
            .attr("fill", (d: any) => this.nodeColor(d.job))
            .call(this.drag(simulation));

        node.append("title")
            .text((d: any) => d.id);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
        });
    }

    drag(simulation) {
        let dragstarted = (event) => {
            if (!event.active) simulation.alphaTarget(0.2).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        let dragged = (event) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        let dragended = (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    linkColor(sentiment): string {
        console.log(sentiment);
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

    nodeColor(job): string {
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

    ngOnInit(): void {
        this.runSimulation(this.links, this.nodes);
    }

}
