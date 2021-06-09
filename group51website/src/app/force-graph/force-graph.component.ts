import { ThrowStmt } from '@angular/compiler';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import { nodeColor } from '../app.component';
import * as d3 from 'd3';
import { ResizedEvent } from 'angular-resize-event';
import { inArray } from 'jquery';

@Component({
    selector: 'app-force-graph',
    templateUrl: './force-graph.component.html',
    styles: [
    ]
})
export class ForceGraphComponent implements AfterViewInit, OnChanges, OnInit {

    @Input() data: Data;
    @Input() selectedNodeInfo;  //id of the node last clicked
    @Input() brushMode;

    @Output() nodeEmailsEvent = new EventEmitter<Array<any>>();  // custom event updatting emails from clicked node to parent component

    showIndividualLinks = false;
    brushedNodes = [];

    private width;
    private height = 800;

    private beginPosX = 0;
    private beginPosY = 0;
    private beginScale = 0.75;

    // variable holding information of clicked node
    nodeinfo;

    constructor() { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit() {
    }

    // -- Funtions to deal with buttons and controls -- \\
    checkLinksOption(event): void {
        this.showIndividualLinks = event.target.checked;
        this.initiateGraph();
    }

    // -- ---- - ---- -- \\
    ngOnChanges(changes: SimpleChanges): void {
        if ('brushMode' in changes) {
            if (this.brushMode) {
                this.enableBrushMode();
            } else {
                this.disableBrushMode();
            }
        } else if ('selectedNodeInfo' in changes) {  //if a new node is selected then no need to refresh the whole graph
            console.log("forcediagram: The node selected is " + this.selectedNodeInfo['id'])
        } else {
            this.initiateGraph();
        }
        this.newNodeSelected()
    }

    initiateGraph() {
        //console.log(this.showIndividualLinks);
        if (this.container) {
            this.width = this.container.nativeElement.offsetWidth;
        }

        this.runSimulation(this.data);
    }

    runSimulation(data): void {
        // Select the link mode
        var selectLinks = (this.showIndividualLinks) ? data.individualLinks : data.groupedLinks;

        // Copy the arrays so they don't get modified elsewhere.
        var links = JSON.parse(JSON.stringify(selectLinks))
        var nodes = JSON.parse(JSON.stringify(data.nodes))
        var mLinkNum = [];

        sortLinks();
        setLinkIndexAndNum();

        const simulation = d3.forceSimulation(nodes)                            //automatically runs simulation
            .force("link", d3.forceLink(links).id((d: any) => d.id))            //Adds forces between nodes, depending on if they're linked
            .force("charge", d3.forceManyBody())                                // nodes repel each other
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));  // nodes get pulled towards the centre of svg

        const svg = d3.select("#force-graph")   //let d3 know where the simulation takes place
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("width", this.width)
            .attr("height", this.height)

        this.beginPosX = ((1 - this.beginScale) / 2) * this.width;
        this.beginPosY = ((1 - this.beginScale) / 2) * this.height;

        svg.selectAll("*").remove();

        var edgeStyle = "line"
        if (this.showIndividualLinks) {
            edgeStyle = "path"
        }

        //adds visuals of the links
        const link = svg.append("g")        //"g" is an element of SVG used to group other SVG elements
            .attr("stroke-opacity", 0.6)
            .selectAll(edgeStyle)
            .data(links)
            .join(edgeStyle)
            .attr("stroke", (d: any) => this.linkColor(d.sentiment, 0))  // 0 is just to show it is not highlighted so color is lighter
            .on("click", (d, i) => {
                linkGUI(i, this.showIndividualLinks);                                //To display info about link
            })


        if (this.showIndividualLinks) {
            link.attr("stroke-width", 2)
            link.append("title")
                .text((d: any) => {
                    return "from: " + d.source.address + "\n" +
                        "to: " + d.target.address + "\n" +
                        "sentiment: " + d.sentiment[0] + "\n" +
                        "type: " + d.type[0];
                })
        } else {
            link.attr("stroke-width", (d: any) => Math.min(Math.sqrt(d.sentiment.length), 8))
        }

        var inst = this; // crude fix to store instance info
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", (d: any) => Math.max(Math.min(Math.sqrt(d.mailCount), 20), 5))
            .attr("fill", (d: any) => nodeColor(d.job))    //colour nodes depending on job title
            .call(this.drag(simulation))                        //makes sure you can drag nodes
            .on("click", function (d, i: any) {
                nodeGUI(inst, i);                                  //To display info about node
                nodeclicked(this, i);                              //Small animation of node
            })
            .on("mouseover", function (event, d: any) {
                d3.select(this)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);
                link.style('stroke', (a: any) => a.source.id === d.id || a.target.id === d.id ? inst.linkColor(a.sentiment, 1) : '#ccc')
            })
            .on("mouseout", function (event, d: any) {
                d3.select(this)
                    .attr("stroke", d.id === inst.selectedNodeInfo['id'] ? 'black' : "#fff")
                    .attr("stroke-width", d.id === inst.selectedNodeInfo['id'] ? 2 : 1)
                //link.style('stroke', (a: any) => inst.selectedNodeInfo['id'].length != 0 ? (a.source.id === inst.selectedNodeInfo['id'] || a.target.id === inst.selectedNodeInfo['id'] ? inst.linkColor(a.sentiment, 1) : '#ccc') : inst.linkColor(a.sentiment, 0))
                inst.newNodeSelected();
            })


        // Displays some useful info if you hover over a node.
        node.append("title")
            .text((d: any) => {
                return "id: " + d.id + "\n" +
                    "e-mail: " + d.address + "\n" +
                    "function: " + d.job;
            });

        svg.call(this.zoom
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", function ({ transform }) {
                node.attr("transform", transform);
                link.attr("transform", transform);
            })
        );

        // Set the zoom to the default levels.
        this.resetZoom()

        //function that updates position of nodes and links
        simulation.on("tick", () => {
            if (this.showIndividualLinks) {
                link.attr("d", (d: any) => {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    // get the total link numbers between source and target node
                    var lTotalLinkNum = mLinkNum[d.target.id + "," + d.source.id] || mLinkNum[d.source.id + "," + d.target.id];
                    if (lTotalLinkNum > 1) {
                        // if there are multiple links between these two nodes, we need generate different dr for each path
                        dr = dr / (1 + (1 / lTotalLinkNum) * (d.linkindex - 0.5));
                    }
                    // generate svg path
                    return "M" + d.source.x + "," + d.source.y +
                        "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y +
                        "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y;
                });
            } else {
                link.attr("x1", (d: any) => d.source.x)
                    .attr("y1", (d: any) => d.source.y)
                    .attr("x2", (d: any) => d.target.x)
                    .attr("y2", (d: any) => d.target.y);
            }

            node
                .attr("cx", (d: any) => {
                    return d.x;
                })
                .attr("cy", (d: any) => {
                    return d.y;
                });
        });

        function nodeclicked(d, i) {
            var nodeRadius = Math.max(Math.min(Math.sqrt(i.mailCount), 20), 5)
            d3.select(d)
                .transition()
                .attr("r", nodeRadius * 2)

                .transition()
                .attr("r", nodeRadius)
            link.style('stroke', (a: any) => inst.selectedNodeInfo['id'].length != 0 ? (a.source.id === inst.selectedNodeInfo['id'] || a.target.id === inst.selectedNodeInfo['id'] ? inst.linkColor(a.sentiment, 1) : '#ccc') : inst.linkColor(a.sentiment, 0))
        }

        function nodeGUI(inst, i) {
            var linklist = { "id": i.id, "job": i.job, "sendto": [], "receivedfrom": [], "mailCount": i.mailCount };

            // console.log(individualLinks);
            var sentLinks = data.individualLinks.filter(function (e) {
                return e.source == i.id;      //Finds emails sent
            })

            var receivedLinks = data.individualLinks.filter(function (e) {
                return e.target == i.id;      //Finds emails received
            })

            for (var link in sentLinks) {
                linklist["sendto"].push(sentLinks[link]['target'])
            }
            for (var link in receivedLinks) {
                linklist["receivedfrom"].push(receivedLinks[link]['source'])
            }

            console.log(linklist);
            inst.nodeEmailsEvent.emit(linklist);  // send lists of email senders/receivers to parent
            inst.nodeinfo = linklist;       // set local version
        }

        function linkGUI(i, showIndividualLinks) {
            var fromNode = nodes.filter(function (e) {
                return e.id == i.source.id;      //Finds from node
            })
            var toNode = nodes.filter(function (e) {
                return e.id == i.target.id;      //Finds to node
            })
            if (showIndividualLinks) {
                console.log("Email from " + fromNode[0]['id'] + " and to " + toNode[0]['id'])
            } else {
                console.log("Email transfers between " + fromNode[0]['id'] + " and " + toNode[0]['id'])
            }

        }

        // sort the links by source, then target
        function sortLinks() {
            links.sort(function (a, b) {
                if (a.source > b.source) {
                    return 1;
                }
                else if (a.source < b.source) {
                    return -1;
                }
                else {
                    if (a.target > b.target) {
                        return 1;
                    }
                    if (a.target < b.target) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }
            });
        }

        //any links with duplicate source and target get an incremented 'linkindex'
        function setLinkIndexAndNum() {
            for (var i = 0; i < links.length; i++) {
                if (i != 0 &&
                    links[i].source == links[i - 1].source &&
                    links[i].target == links[i - 1].target) {
                    links[i].linkindex = links[i - 1].linkindex + 1;
                }
                else {
                    links[i].linkindex = 1;
                }
                // save the total number of links between two nodes
                if (mLinkNum[links[i].target + "," + links[i].source] !== undefined) {
                    mLinkNum[links[i].target + "," + links[i].source]++;
                }
                else {
                    mLinkNum[links[i].source + "," + links[i].target] = links[i].linkindex;
                }
            }
        }
    }

    // Updates the selected/highlighted nodes
    newNodeSelected() {
        var edgeStyle = "line"

        if (this.showIndividualLinks) {
            edgeStyle = "path"
        }

        var svg = d3.select("#force-graph")
        var node = svg.selectAll('circle')
        var link = svg.selectAll(edgeStyle)

        link.style('stroke', (a: any) => {
            if (this.selectedNodeInfo['id'].length != 0 || this.brushedNodes.length != 0) {
                var highlighted = (this.brushedNodes.includes(a.source.id) || this.brushedNodes.includes(a.target.id)) ||
                    (a.source.id === this.selectedNodeInfo['id'] || a.target.id === this.selectedNodeInfo['id'])
                return (highlighted ? this.linkColor(a.sentiment, 1) : '#ccc')
            }
            else {
                return this.linkColor(a.sentiment, 0)
            }
        })
        node.attr("stroke", (a: any, d: any) => {
            var selected = a.id === this.selectedNodeInfo['id'] || this.brushedNodes.includes(a.id);
            return selected ? "black" : "#fff"
        });
        node.attr("stroke-width", (a: any, d: any) => a.id === this.selectedNodeInfo['id'] ? 2 : 1)
    }

    //to drag nodes around
    //for a better understanding of alphaTarget (and alphaMin) check API or https://stackoverflow.com/questions/46426072/what-is-the-difference-between-alphatarget-and-alphamin
    drag(simulation) {
        let dragstarted = (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();   //alphaTarget indicates how eager the nodes are to move. Changing this parameter changes behaviour of graph!!!
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        let dragged = (event) => {          //if node is being dragged, update position of node
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        let dragended = (event) => {
            if (!event.active) simulation.alphaTarget(0);       //drag has ended, the simulation stops moving  (alphaTarget(0))
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    //link colour based on sentiment of message
    linkColor(sentiment, highlighted): string {
        // console.log(sentiment);
        for (var s of sentiment) {
            if (s > 0.1) {
                return "#55EE55";
            }

            if (s < -0.1) {
                return "#EE5555";
            }
        }
        if (highlighted) {
            return "#404040"
        }
        return "#999999";
    }

    onResized(event: ResizedEvent) {
        this.width = event.newWidth;
        this.height = event.newHeight;

        const svg = d3.select("#force-graph")   //let d3 know where the simulation takes place
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("width", this.width)
            .attr("height", this.height)
    }

    enableBrushMode() {
        const svg = d3.select("#force-graph")
        svg.on(".zoom", null);  // Disable zooming when in brush mode.

        var inst = this;
        svg.call(d3.brush()                     // Add the brush feature using the d3.brush function
            .extent([[0, 0], [this.width, this.height]])       // initialise the brush area, so the entire graph
            .on("start end", function (e) {
                inst.brushedNodes = [];
                if (e.selection) {
                    var x0 = e.selection[0][0],
                        x1 = e.selection[1][0],
                        y0 = e.selection[0][1],
                        y1 = e.selection[1][1];

                    svg.selectAll("circle")
                        .each(function (d: any) {
                            //var cx = d3.select(this).attr("cx");
                            //var cy = d3.select(this).attr("cy");

                            // Gets the transform as a string: "translate(x, y) scale(s)""
                            var transform = d3.select(this).attr("transform").split(" ");
                            var transString: any = transform[0];
                            var transString = transString.substring(transString.indexOf("(") + 1, transString.indexOf(")")) // Get the part between ()
                                .split(","); // Split the x and y coordinate

                            // Parse the translation to numbers.
                            var tx = parseFloat(transString[0]);
                            var ty = parseFloat(transString[1]);

                            // Get the scale srting and retrieve the part between ().
                            var scaleString = transform[1];
                            var scaleString = scaleString.substring(scaleString.indexOf("(") + 1, scaleString.indexOf(")"));
                            var scale = parseFloat(scaleString);    // Parse the string to a number.

                            // Apply the translation to the x coordinate of the node to get the real coordinate.
                            var x = (d.x * scale) + tx;
                            var y = (d.y * scale) + ty;

                            // Check whether the real coordinate is in our box.
                            var isSelected = x0 <= x && x <= x1 && y0 <= y && y <= y1;
                            if (isSelected) {
                                inst.brushedNodes.push(d.id)
                            }
                        })
                }
                inst.newNodeSelected();
            })
        )
    }

    disableBrushMode() {
        const svg = d3.select("#force-graph")

        // Disable the brush
        svg.call(d3.brush().extent([[0, 0], [0, 0]]))
        svg.on(".brush", null);
        svg.selectAll("rect").remove();

        var node = svg.selectAll("circle")
        var link = svg.selectAll("line")

        // Add the zoom and panning back
        svg.call(this.zoom
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", function ({ transform }) {
                node.attr("transform", transform);
                link.attr("transform", transform);
            })
        )
    }

    resetZoom(): void {
        const svg = d3.select("#force-graph");
        svg.selectAll("circle")
            .attr("transform", `translate(${this.beginPosX},${this.beginPosY}) scale(${this.beginScale})`)
        svg.selectAll("line")
            .attr("transform", `translate(${this.beginPosX},${this.beginPosY}) scale(${this.beginScale})`)

        svg.call(this.zoom.transform as any, d3.zoomIdentity.translate(this.beginPosX, this.beginPosY).scale(this.beginScale))
    }

    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
        this.runSimulation(this.data);
    }

    @ViewChild('container')
    container: ElementRef;
}
