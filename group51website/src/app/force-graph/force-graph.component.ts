import { DataShareService } from './../data-share.service';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import { globalBrushDisable, nodeColor } from '../app.component';
import * as d3 from 'd3';
import { ResizedEvent } from 'angular-resize-event';
import { inArray } from 'jquery';
import { Subscription } from 'rxjs';
import { BrushShareService } from '../brush-share.service';

@Component({
    selector: 'app-force-graph',
    providers: [DataShareService],
    templateUrl: './force-graph.component.html',
    styles: [
    ]
})
export class ForceGraphComponent implements AfterViewInit, OnChanges, OnInit {

    data: Data;
    selectedNodeInfo: any = { 'id': -1 }  //id, etc... of the node last clicked

    //@Output() nodeEmailsEvent = new EventEmitter<Array<any>>();  // custom event updatting emails from clicked node to parent component

    showIndividualLinks = false;
    brushedNodes = [];
    brushEnabled = false;

    private width;
    private height = 800;

    private beginPosX = 0;
    private beginPosY = 0;
    private beginScale = 0.75;

    private dataSubscription: Subscription;
    private selectedSubscription: Subscription;
    private brushSubscription: Subscription;

    constructor() { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit(): void {
        console.log("forceGraph: initialising: subbing to Service!")

        this.dataSubscription = DataShareService.sdatasource.subscribe(newData => {
            console.log("forceGraph: Datashareservice: data update detected!");
            this.data = newData;
            this.initiateGraph();
            this.newNodeSelected();
        })

        this.selectedSubscription = DataShareService.sselectednode.subscribe(newNode => {
            console.log("forcegraph: new selected node received!")
            const hasChanged: boolean = (this.selectedNodeInfo["id"] != newNode["id"])
            this.selectedNodeInfo = newNode;
            if (hasChanged == true) {
                console.log("forcegraph: The node selected is " + this.selectedNodeInfo['id'])
            } else {
                console.log("forcegraph: new selected node was already selected!")
            }
            this.newNodeSelected();
        })

        this.brushSubscription = BrushShareService.brushSource.subscribe(newBrush => {
            // The mode stayed the same, meaning the brushedNodes must have changed.
            if (this.brushEnabled == newBrush.brushEnabled) {
                if (this.brushedNodes != newBrush.brushedNodes) { // Check if we didn't get the changes from ourselves
                    //console.log(newBrush);
                    this.brushedNodes = newBrush.brushedNodes;
                    this.newNodeSelected();
                }
            } else { // We didnt get into the if, so the mode must have changed.
                this.brushEnabled = newBrush.brushEnabled;
                if (this.brushEnabled) {
                    this.enableBrushMode();
                } else {
                    this.disableBrushMode();
                }
            }
        })
    }

    ngOnDestroy() {
        this.brushSubscription.unsubscribe();
        this.dataSubscription.unsubscribe();
        this.selectedSubscription.unsubscribe();
    }

    // -- Funtions to deal with buttons and controls -- \\
    checkLinksOption(event): void {
        this.showIndividualLinks = event.target.checked;

        globalBrushDisable();
        this.initiateGraph();
        this.newNodeSelected();
    }

    // -- ---- - ---- -- \\
    ngOnChanges(changes: SimpleChanges): void {
        /* MOVED TO SUBSCRIPTION
        if ('selectedNodeInfo' in changes) {  //if a new node is selected then no need to refresh the whole graph
            console.log("forcediagram: The node selected is " + this.selectedNodeInfo['id'])
        } else {
            this.initiateGraph();
        }
        this.newNodeSelected()
        */
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
            .attr("stroke", (d: any) => this.linkColor(d.sentiment, 1))  // 0 is just to show it is not highlighted so color is lighter
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
                link.style('stroke', (a: any) => (d.id === a.source.id || d.id === a.target.id) ? inst.linkColor(a.sentiment, 1) : inst.linkColor(a.sentiment, 0))
            })
            .on("mouseout", function (event, d: any) {
                d3.select(this)
                    .attr("stroke", d.id === inst.selectedNodeInfo['id'] ? 'black' : "#fff")
                    .attr("stroke-width", d.id === inst.selectedNodeInfo['id'] ? 2 : 1)
                link.style('stroke', (a: any) => inst.selectedNodeInfo['id'] != 0 ? (a.source.id === inst.selectedNodeInfo['id'] || a.target.id === inst.selectedNodeInfo['id'] ? inst.linkColor(a.sentiment, 1) : inst.linkColor(a.sentiment, 0)) : inst.linkColor(a.sentiment, 1))
                inst.newNodeSelected();
            })


        // Displays some useful info if you hover over a node.
        node.append("title")
            .text((d: any) => {
                return "id: " + d.id + "\n" +
                    "e-mail: " + d.address + "\n" +
                    "function: " + d.job;
            });

        if (!this.brushEnabled) {
            var graph = svg.selectAll("g");
            svg.call(this.zoom
                .extent([[0, 0], [this.width, this.height]])
                .on("zoom", function ({ transform }) {
                    graph.attr("transform", transform);
                })
            );
        }

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
            link.style('stroke', (a: any) => inst.selectedNodeInfo['id'] != 0 ? (a.source.id === inst.selectedNodeInfo['id'] || a.target.id === inst.selectedNodeInfo['id'] ? inst.linkColor(a.sentiment, 1) : inst.linkColor(a.sentiment, 0)) : inst.linkColor(a.sentiment, 0))
        }

        function nodeGUI(inst, i) {
            var linklist = { 
                "id": i.id, 
                "job": i.job, 
                "sendto": [], 
                "receivedfrom": [], 
                "mailCount": i.mailCount, 
                "address": i.address, 
                "sentiment_received": {
                    "pos" : 0.0,
                    "neg" : 0.0,
                }, 
                "sentiment_send": {
                    "pos" : 0.0,
                    "neg" : 0.0,
                }, 
            };

            // console.log(individualLinks);
            var sentLinks = data.individualLinks.filter(function (e) {
                return e.source == i.id;      //Finds emails sent
            })

            var receivedLinks = data.individualLinks.filter(function (e) {
                return e.target == i.id;      //Finds emails received
            })

            let sent_counter = {"pos": 0, "neg": 0}  // counts nr of pos and neg emails
            for (var link in sentLinks) {
                linklist["sendto"].push(sentLinks[link]['target'])
                
                // compute sentiment from node
                let s: number = parseFloat(sentLinks[link]['sentiment']);
                if (s >= 0.0){
                    linklist.sentiment_send.pos += s
                    sent_counter.pos++;
                    console.log("card: send positive vibes: "+ s.toString())
                } else if (s < 0.0){
                    linklist.sentiment_send.neg += s
                    sent_counter.neg++;
                    console.log("card: send negative vibes: "+ s.toString())
                } else {
                    console.log("card: error while computing send vibes: s is not comparing...")
                    console.log("card: s = "+s.toString())
                    console.log("card: list p/n: "+linklist.sentiment_send.pos.toString() + ' / '+ linklist.sentiment_send.neg.toString())
                }
            }

            let recieved_counter = {"pos": 0, "neg": 0}  // counts nr of pos and neg emails
            for (var link in receivedLinks) {
                linklist["receivedfrom"].push(receivedLinks[link]['source'])
                
                // compute sentiment from node
                let s: number = parseFloat(receivedLinks[link]['sentiment']);
                if (s >= 0.0){
                    linklist.sentiment_received.pos += s
                    recieved_counter.pos++;
                    console.log("card: got positive vibes: "+ s.toString())
                } else if (s < 0.0){
                    linklist.sentiment_received.neg += s
                    recieved_counter.neg++;
                    console.log("card: got negative vibes: "+ s.toString())
                } else {
                    console.log("card: error while computing gotten vibes: s is not comparing...")
                    console.log("card: s = "+s.toString())
                    console.log("card: list p/n: "+linklist.sentiment_received.pos.toString() + ' / '+ linklist.sentiment_received.neg.toString())
                }
            }

            // convert sentiment to ratio
            console.log("card: converting all vibes to avrg...")
            let total: number = linklist.sentiment_received.pos

            linklist.sentiment_received.pos = total / sent_counter.pos;
            console.log("card: rpositive: "+ linklist.sentiment_received.pos)
            total = linklist.sentiment_received.neg
            linklist.sentiment_received.neg = total / sent_counter.neg;
            console.log("card: rnegative: "+ linklist.sentiment_received.neg)

            total = linklist.sentiment_send.pos
            linklist.sentiment_send.pos = total / recieved_counter.pos;
            console.log("card: rpositive: "+ linklist.sentiment_send.pos)
            total = linklist.sentiment_send.neg
            linklist.sentiment_send.neg = total / recieved_counter.neg;
            console.log("card: rnegative: "+ linklist.sentiment_send.neg)

            if (recieved_counter.neg == 0) {linklist.sentiment_received.neg = 0}
            if (recieved_counter.pos == 0) {linklist.sentiment_received.pos = 0}
            if (sent_counter.neg == 0) {linklist.sentiment_send.neg = 0}
            if (sent_counter.pos == 0) {linklist.sentiment_send.pos = 0}

            if (linklist['id'] === inst.selectedNodeInfo['id']){
                for (var member in linklist) delete linklist[member];
                console.log(linklist)
                //linklist = { 'id': undefined, 'job': [], 'sendto': [], 'receivedfrom': [], "mailCount": [] };
            }
            
            console.log("forcegraph: updating selected node to service...");
            //inst.nodeEmailsEvent.emit(linklist);  
            DataShareService.updateServiceNodeSelected(linklist); // send lists of email senders/receivers to service
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
            if (this.selectedNodeInfo['id'] != undefined ||  this.brushedNodes.length != 0) {
                var highlighted = (this.brushedNodes.includes(a.source.id) || this.brushedNodes.includes(a.target.id)) ||
                    (a.source.id === this.selectedNodeInfo['id'] || a.target.id === this.selectedNodeInfo['id'])
                return (highlighted ? this.linkColor(a.sentiment, 1) : this.linkColor(a.sentiment, 0))
            }
            else {
                return this.linkColor(a.sentiment, 1)
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
            if (highlighted) {
                if (s > 0.1) {
                    return "#55EE55";
                }

                if (s < -0.1) {
                    return "#EE5555";
                }
            } else {
                if (s > 0.1) {
                    return "#89ff89"; //#76ff76
                }
                if (s < -0.1) {
                    return "#ffadad";
                }
            }
        }
        if (highlighted) {
            return "#404040"
        }
        return "#ccc";
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

                    // TODO: The transformation is the same for every node, 
                    // so parsing it for every node is a bit of a waste of time.
                    // We should do parse it for one node and then use that tx, ty and scale for all of them. - Kay
                    // Gets the transform as a string: "translate(x, y) scale(s)""
                    var transform = d3.select("g").attr("transform").split(" ");
                    var transString: any = transform[0];
                    transString = transString.substring(transString.indexOf("(") + 1, transString.indexOf(")")) // Get the part between ()
                        .split(","); // Split the x and y coordinate

                    // Parse the translation to numbers.
                    var tx = parseFloat(transString[0]);
                    var ty = parseFloat(transString[1]);

                    // Get the scale srting and retrieve the part between ().
                    var scaleString = transform[1];
                    scaleString = scaleString.substring(scaleString.indexOf("(") + 1, scaleString.indexOf(")"));
                    var scale = parseFloat(scaleString);    // Parse the string to a number.

                    svg.selectAll("circle")
                        .each(function (d: any) {
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
                BrushShareService.updateBrush({
                    brushEnabled: inst.brushEnabled,
                    brushedNodes: inst.brushedNodes,
                });
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

        var graph = svg.selectAll("g");
        // Add the zoom and panning back
        svg.call(this.zoom
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", function ({ transform }) {
                graph.attr("transform", transform);
            })
        )
    }

    resetZoom(): void {
        const svg = d3.select("#force-graph");
        svg.selectAll("g")
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
