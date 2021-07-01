import { DataShareService } from './../data-share.service';
import { Subscription } from 'rxjs';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { globalBrushDisable, jobs, nodeColor } from '../app.component';
import { BrushShareService } from '../brush-share.service';
import { ResizedEvent } from 'angular-resize-event';
//we need to import this component in the app.module.ts
//we need to add the line below to visualisation-page.component.html:
//<app-arc-diagram [file]="file"></app-arc-diagram>

@Component({
    selector: 'app-arc-diagram',
    templateUrl: './arc-diagram.component.html',
    styles: [
    ]
})
export class ArcDiagramComponent implements AfterViewInit, OnInit {

    // Input variables.
    data: Data;
    sort: string;
    selectedNodeInfo: any = { id: -1 };
    vis2Fullscreen: boolean = false;
    vis1Fullscreen: boolean = false;
    //@Output() nodeEmailsEvent = new EventEmitter<Array<any>>();  // custom event updatting emails from clicked node to parent component

    public width: number = 1000;
    public height: number = 800;
    private svg;
    private brushedNodes = [];
    private brushEnabled = false;
    private fullScreen: boolean = false;
    private datasubscription: Subscription;
    private selectedSubscription: Subscription;
    private fullscreen1Subscription: Subscription;
    private fullscreen2Subscription: Subscription;
    private brushSubscription: Subscription;

    constructor() { }

    ngOnInit() {
        this.svg = d3.select("#arc-diagram")
            .attr('width', this.width)
            .attr('height', this.height)
        console.log("arcDiagram: initialising: subbing to Service!")

        this.datasubscription = DataShareService.sdatasource.subscribe(newData => {
            console.log("arcDiagram: Datashareservice: data update detected!");
            this.data = newData;
            this.initiateDiagram();
            this.newNodeSelected();
        })

        this.selectedSubscription = DataShareService.sselectednode.subscribe(newNode => {
            console.log("arcdiagram: new selected node received!")
            let hasChanged: boolean = false
            if (this.selectedNodeInfo.hasOwnProperty("id")) {
                hasChanged = (this.selectedNodeInfo["id"] != newNode["id"])
            } else {
                hasChanged = true
            }
            this.selectedNodeInfo = newNode;
            if (hasChanged == true) {
                console.log("arcdiagram: The node selected is " + this.selectedNodeInfo['id'])
            } else {
                console.log("arcdiagram: new selected node was already selected!")
                // this.initiateDiagram();
            }
            this.newNodeSelected();
        })

        this.fullscreen2Subscription = DataShareService.svis2Fullscreen.subscribe(newBool => {
            console.log("arcdiagram: new vis2Fullscreen received: " + newBool)
            const hasChanged: boolean = (this.vis2Fullscreen != newBool)
            if (hasChanged == true) {
                this.vis2Fullscreen = newBool
                console.log("arcdiagram: the new vis2fscr value is " + newBool);
                this.initiateDiagram();
                this.newNodeSelected()
            } else {
                console.log("arcdiagram: vis2fscr value wasn't changed");
            }

        })

        this.fullscreen1Subscription = DataShareService.svis1Fullscreen.subscribe(newBool => {
            console.log("arcdiagram: new vis1Fullscreen received: " + newBool)
            const hasChanged: boolean = (this.vis1Fullscreen != newBool)
            if (hasChanged == true) {
                this.vis1Fullscreen = newBool
                console.log("arcdiagram: the new vis1fscr value is " + newBool);
                this.initiateDiagram();
                this.newNodeSelected()
            } else {
                console.log("arcdiagram: vis1fscr value wasn't changed");
            }

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
            /*.attr("width", this.width)
            .attr("height", this.height);*/

        })
    }

    ngOnDestroy() {
        this.brushSubscription.unsubscribe();
        this.datasubscription.unsubscribe();
        this.selectedSubscription.unsubscribe();
    }

    // -- Button functions -- \\
    checkSortOption(event): void {
        // console.log(event.target);
        this.sort = event.target.value;
        globalBrushDisable();
        this.initiateDiagram();
    }

    onResized(event: ResizedEvent) {
        //console.log("//////////----------------///////////");
        this.width = event.newWidth;
        this.height = event.newHeight;
        // console.log(event.newHeight);
        // console.log(event.newWidth);

        // set the width and height of the element (account for margins)
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)

        //this.fullScreen == false ? this.fullScreen = true : this.fullScreen = false;
        this.initiateDiagram()
    }

    initiateDiagram() {
        this.runDiagram(this.data);
    }

    runDiagram(data): void {
        var inst = this; // crude fix to store instance info

        var links = JSON.parse(JSON.stringify(data.groupedLinks))
        var nodes = JSON.parse(JSON.stringify(data.nodes))

        if (this.sort == "id") {
            sortNodesID();
        } else if (this.sort == "job") {
            sortNodesJob();
        } else if (this.sort == "amount") {
            sortNodesAmount();
        }

        this.svg.selectAll("*").remove()

        //CEO, President, Vice President, Managing Director, Director, In House Lawyer, Trader, Employee, Unknown.
        function sortNodesJob() {
            nodes.sort(function (a, b) {
                if (a.job == b.job) {
                    return (a.id < b.id ? -1 : 1);
                } else { //broky
                    return jobs.indexOf(a.job) - jobs.indexOf(b.job); //either positive or negative, sorted accordingly
                }
            })
        }

        function sortNodesID() {
            nodes.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1
                }
            })
        }

        function sortNodesAmount() {
            nodes.sort(function (a, b) {
                if (a.mailCount == b.mailCount) {
                    return (a.id < b.id ? -1 : 1);
                } else {
                    return (a.mailCount > b.mailCount ? -1 : 1);
                }
            })
        }

        //console.log(nodes);
        var nodeID = [];
        for (var i = 0; i < nodes.length; i++) {
            //nodeID.push(Object.values(Object.values(Object.values(nodes))[i]));
            nodeID.push(Object.values(nodes[i])[0]);
        }

        var x = d3.scalePoint()
            .range([0, this.height])
            .padding(0.5)
            .domain(nodeID);
        var y = d3.scalePoint()
            .range([0, this.width])
            .padding(0.5)
            .domain(nodeID)

        var nodeRadius = 2;
        //add circles for the nodes

        //This is the ugliest solution ever. It makes the text boxes longer, making it easier to interact with them with mouse-events
        function makeText(d) {
            if (d.id.length == 3) {
                return " \u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }

        }

        function nodeGUI(i) {
            var linklist = {
                "id": i.id,
                "job": i.job,
                "sendto": [],
                "receivedfrom": [],
                "mailCount": i.mailCount,
                "mailReceived": i.mailReceived,
                "mailSent": i.mailSent,
                "address": i.address,
                "sentiment_total": 0.0,
                "sentiment_received": {
                    "total": 0.0,
                    "pos": 0.0,
                    "neg": 0.0,
                },
                "sentiment_send": {
                    "total": 0.0,
                    "pos": 0.0,
                    "neg": 0.0,
                },
            };

            // console.log(individualLinks);
            var sentLinks = data.individualLinks.filter(function (e) {
                return e.source == i.id;      //Finds emails sent
            })

            var receivedLinks = data.individualLinks.filter(function (e) {
                return e.target == i.id;      //Finds emails received
            })

            let sent_counter = { "pos": 0, "neg": 0, "total": 0 }  // counts nr of pos and neg emails
            for (var link in sentLinks) {
                linklist["sendto"].push(sentLinks[link]['target'])

                // compute sentiment from node
                let s: number = parseFloat(sentLinks[link]['sentiment']);
                if (s >= 0.1) {
                    linklist.sentiment_send.pos += s
                    sent_counter.pos++;
                } else if (s <= -0.1) {
                    linklist.sentiment_send.neg += s
                    sent_counter.neg++;
                }

                linklist.sentiment_total += s;
                linklist.sentiment_send.total += s;
                sent_counter.total++;
            }

            let received_counter = { "pos": 0, "neg": 0, "total": 0 }  // counts nr of pos and neg emails
            for (var link in receivedLinks) {
                linklist["receivedfrom"].push(receivedLinks[link]['source'])

                // compute sentiment from node
                let s: number = parseFloat(receivedLinks[link]['sentiment']);
                if (s >= 0.1) {
                    linklist.sentiment_received.pos += s
                    received_counter.pos++;
                } else if (s <= -0.1) {
                    linklist.sentiment_received.neg += s
                    received_counter.neg++;
                }

                linklist.sentiment_total += s;
                linklist.sentiment_received.total += s
                received_counter.total++;
            }

            // convert sentiment to ratio
            let total: number = linklist.sentiment_send.pos
            if (sent_counter.pos == 0) {
                linklist.sentiment_send.pos = 0
            } else {
                linklist.sentiment_send.pos = total / sent_counter.pos;
            }

            total = linklist.sentiment_send.neg
            if (sent_counter.neg == 0) {
                linklist.sentiment_send.neg = 0;
            } else {
                linklist.sentiment_send.neg = total / sent_counter.neg;
            }

            total = linklist.sentiment_received.pos
            if (received_counter.pos == 0) {
                linklist.sentiment_received.pos = 0
            } else {
                linklist.sentiment_received.pos = total / received_counter.pos;
            }

            total = linklist.sentiment_received.neg
            if (received_counter.neg == 0) {
                linklist.sentiment_received.neg = 0
            } else {
                linklist.sentiment_received.neg = total / received_counter.neg;
            }

            if (received_counter.total + sent_counter.total == 0) {
                linklist.sentiment_total = 0;
            } else {
                linklist.sentiment_total /= (received_counter.total + sent_counter.total);
            }

            if (received_counter.total == 0) {
                linklist.sentiment_received.total = 0;
            } else {
                linklist.sentiment_received.total /= received_counter.total;
            }

            if (sent_counter.total == 0) {
                linklist.sentiment_send.total = 0;
            } else {
                linklist.sentiment_send.total /= sent_counter.total;
            }

            if (inst.selectedNodeInfo['id'] === -1) {
                for (var member in linklist) delete linklist[member];
            }

            DataShareService.updateServiceNodeSelected(linklist); // send lists of email senders/receivers to service
        }

        if (!this.vis2Fullscreen && !this.vis1Fullscreen) {
            const node = this.svg.selectAll("mynodes")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("cy", function (d: any) { return (x(d.id)) })
                .attr("cx", 30)
                .attr("r", nodeRadius)
                .style("fill", (d: any) => nodeColor(d.job));
            //function(d){ return(x(d.name))}
            //add labels for nodes 
            node.append("title")
                .text((d: any) => {
                    return "id: " + d.id + "\n" +
                        "e-mail: " + d.address + "\n" +
                        "function: " + d.job;
                });

            let foundSelectedNode = false;
            node.each(function (d: any) {
                if (d.id == inst.selectedNodeInfo['id']) {
                    foundSelectedNode = true;
                    nodeGUI(d);
                }
            })

            if (!foundSelectedNode) {
                this.selectedNodeInfo['id'] = -1;
                DataShareService.updateServiceNodeSelected({});
            }

            const label = this.svg.selectAll("mylabels")
                .data(nodes)
                .enter()
                .append("text")
                .attr("font-size", "8")
                .attr("font-family", "sans-serif")
                .attr("x", 12)
                .attr("transform", (d: any) => `translate(${0},${d.y = x(d.id) + nodeRadius + 1})`)
                .text(d => makeText(d))
                .style("text-anchor", "middle")
                .style('fill', "#000")
                .on("click", (event, d: any) => {
                    if (inst.selectedNodeInfo['id'] == d.id) {
                        inst.selectedNodeInfo['id'] = -1;
                    }

                    nodeGUI(d)
                })
                //creating rectangles would make this event handling a lot more consistent, now you really have to aim your mouse to hit the text
                .on("mouseover", function (event, d: any) {
                    label.style('fill', "#ccc")
                    d3.select(this).style('font-weight', 'bold')
                    d3.select(this).style('fill', "#000")
                    link.style('stroke', (a: any) => a.source === d.id || a.target === d.id ? nodeColor(d.job) : inst.linkColorHover(a.sentiment))
                    //.style('stroke-width', (a: any) => a.source === d.id || a.target === d.id ? 2 : 1)
                })
                .on("mouseout", function (event, d: any) {
                    label.style('fill', (a: any) => inst.selectedNodeInfo['id'] != undefined ? (a.id === inst.selectedNodeInfo['id'] ? '#000' : '#ccc') : '#000')
                    label.style('font-weight', (a: any) => inst.selectedNodeInfo['id'] != undefined ? (a.id === inst.selectedNodeInfo['id'] ? 'bold' : 'normal') : 'normal')
                    link.style('stroke', (a: any) => inst.selectedNodeInfo['id'] != undefined ? (a.source === inst.selectedNodeInfo['id'] || a.target === inst.selectedNodeInfo['id'] ? nodeColor(inst.selectedNodeInfo['job']) : inst.linkColorHover(a.sentiment)) : inst.linkColor(a.sentiment))
                })
                .call(mylabels => mylabels.append("text")
                    .attr("x", 1)
                    .attr("dy", "0.35em")
                    .attr("fill", "#008000") //d3.lab(color(d.group)).darker(2)
                    .text(d => makeText(d)));
            label.append("title")
                .text((d: any) => {
                    return "id: " + d.id + "\n" +
                        "e-mail: " + d.address + "\n" +
                        "function: " + d.job;
                });
            /*const overlay = this.svg.append("g")
                .attr("fill", " none")
                .attr("pointer-events", "all")
                .selectAll('rect')
                .data(nodes)
                .join('rect')
                    .attr("width", 23)
                    .attr("height", 3)
                    .attr('y', d=>x(d.id) - 1.5)
                    .on("mouseover", function(event,d) {
                        label.style('fill', "#ccc")
                        d3.selectAll("mylabels").select(label).style('fill', '#69b3b2')
                        link.style('stroke', a=> a.source === d.id || a.target === d.id ? '#69b3b2' : '#ccc')   
                        .style('stroke-width', a=>a.source === d.id || a.target === d.id ? 2 : 1)
                    })
                    */
            //add the links

            const link = this.svg.selectAll('mylinks')
                .data(links)
                .enter()
                .append('path')
                .attr('d', function (d: any) {
                    var start = x(d.source)    // X position of start node on the X axis
                    //console.log(start);
                    var end = x(d.target)      // X position of end node
                    return ['M', 30, start,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                        'A',                            // This means we're gonna build an elliptical arc
                        (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                        (start - end) / 2, 0, 0, ',',
                        start < end ? 1 : 0, 30, ',', end] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down. Final numerical value of this line determines x coordinate of endpoints of arc.
                        .join(' ');
                })
                .style("fill", "none")
                .attr("stroke", (d: any) => this.linkColor(d.sentiment))
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", (d: any) => Math.max(Math.min(Math.sqrt(d.sentiment.length), nodeRadius * 2), 1));
        } else if (this.vis2Fullscreen || this.vis1Fullscreen) {
            const node = this.svg.selectAll("mynodes")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("cx", function (d: any) { return (y(d.id)) })
                .attr("cy", this.height - 30)
                .attr("r", nodeRadius)
                .style("fill", (d: any) => nodeColor(d.job));
            //function(d){ return(x(d.name))}
            //add labels for nodes 
            node.append("title")
                .text((d: any) => {
                    return "id: " + d.id + "\n" +
                        "e-mail: " + d.address + "\n" +
                        "function: " + d.job;
                });

            let foundSelectedNode = false;
            node.each(function (d: any) {
                if (d.id == inst.selectedNodeInfo['id']) {
                    foundSelectedNode = true;
                    nodeGUI(d);
                }
            })

            if (!foundSelectedNode) {
                this.selectedNodeInfo['id'] = -1;
                DataShareService.updateServiceNodeSelected({});
            }

            const label = this.svg.selectAll("mylabels")
                .data(nodes)
                .enter()
                .append("text")
                .attr("font-size", "8")
                .attr("font-family", "sans-serif")
                .attr("x", this.height - 15)
                .attr("y", 7)
                .attr("transform", (d: any) => `translate(${d.x = y(d.id) + nodeRadius + 1},${0}) rotate(90)`)
                .text(d => makeText(d))
                .style("text-anchor", "middle")
                .on("click", (event, d: any) => {
                    if (inst.selectedNodeInfo['id'] == d.id) {
                        inst.selectedNodeInfo['id'] = -1;
                    }
                    nodeGUI(d)
                })
                //creating rectangles would make this event handling a lot more consistent, now you really have to aim your mouse to hit the text
                .on("mouseover", function (event, d: any) {
                    label.style('fill', "#ccc")
                    d3.select(this).style('font-weight', 'bold')
                    d3.select(this).style('fill', "#000")
                    link.style('stroke', (a: any) => a.source === d.id || a.target === d.id ? nodeColor(d.job) : inst.linkColorHover(a.sentiment))
                    //.style('stroke-width', (a: any) => a.source === d.id || a.target === d.id ? 2 : 1)
                })
                .on("mouseout", function (event, d: any) {
                    label.style('fill', (a: any) => inst.selectedNodeInfo['id'] != undefined ? (a.id === inst.selectedNodeInfo['id'] ? '#000' : '#ccc') : '#000')
                    label.style('font-weight', (a: any) => inst.selectedNodeInfo['id'] != undefined ? (a.id === inst.selectedNodeInfo['id'] ? 'bold' : 'normal') : 'normal')
                    link.style('stroke', (a: any) => inst.selectedNodeInfo['id'] != undefined ? (a.source === inst.selectedNodeInfo['id'] || a.target === inst.selectedNodeInfo['id'] ? nodeColor(inst.selectedNodeInfo['job']) : inst.linkColorHover(a.sentiment)) : inst.linkColor(a.sentiment))
                })
                .call(mylabels => mylabels.append("text")
                    .attr("y", 12)
                    .attr("dx", "0.35em")
                    .attr("fill", "#008000") //d3.lab(color(d.group)).darker(2)
                    .text(d => makeText(d)));
            label.append("title")
                .text((d: any) => {
                    return "id: " + d.id + "\n" +
                        "e-mail: " + d.address + "\n" +
                        "function: " + d.job;
                });

            const link = this.svg.selectAll('mylinks')
                .data(links)
                .enter()
                .append('path')
                .attr('d', function (d: any) {
                    var start = y(d.source)    // X position of start node on the X axis
                    //console.log(start);
                    var end = y(d.target)      // X position of end node
                    return ['M', start, 770,    // the arc starts at the coordinate y=start, x=width-30 (where the starting node is)
                        'A',                            // This means we're gonna build an elliptical arc
                        (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                        (start - end) / 2, 0, 0, ',',
                        start < end ? 1 : 0, end, ',', 770] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down. Final numerical value of this line determines x coordinate of endpoints of arc.
                        .join(' ');
                })
                .style("fill", "none")
                .attr("stroke", (d: any) => this.linkColor(d.sentiment))
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", (d: any) => Math.max(Math.min(Math.sqrt(d.sentiment.length), nodeRadius * 2), 1));
        }
    }

    newNodeSelected() {
        //const svg = d3.select("#arc-diagram")
        //const node = svg.selectAll("circle")
        const label = this.svg.selectAll("text")
        const link = this.svg.selectAll('path')

        //label.style('stroke', "#ccc")
        label.style('font-weight', (a: any) => {
            if (a.id === this.selectedNodeInfo['id'] ||
                this.brushedNodes.includes(a.id)) {
                return 'bold'
            } else {
                return 'plain'
            }
        });
        label.style('fill', (a: any) => {
            // If there is a selected node...
            if (this.selectedNodeInfo['id'] != undefined ||
                this.brushedNodes.length != 0) {
                // Color it based on whether it is selected or not.
                if (a.id === this.selectedNodeInfo['id'] ||
                    this.brushedNodes.includes(a.id)) {
                    return "#000"
                } else {
                    return '#ccc'
                }
            } else {
                return "#000"
            }
        });
        link.style('stroke', (a: any) => {
            if (this.selectedNodeInfo['id'] != undefined) {
                if (a.source === this.selectedNodeInfo['id'] || a.target === this.selectedNodeInfo['id'] ||
                    this.brushedNodes.includes(a.source) || this.brushedNodes.includes(a.target)) {
                    return nodeColor(this.selectedNodeInfo['job'])
                } else {
                    return this.linkColorHover(a.sentiment)
                }
            } else {
                return this.linkColor(a.sentiment)
            }
        })

    }

    enableBrushMode() {
        //const svg = d3.select("#arc-diagram");
        var inst = this;
        this.svg.call(d3.brush()                     // Add the brush feature using the d3.brush function
            .extent([[0, 0], [this.width, this.height]])       // initialise the brush area, so the entire graph
            .on("start end", function (e) {
                inst.brushedNodes = [];
                if (e.selection) {
                    var x0 = e.selection[0][0],
                        x1 = e.selection[1][0],
                        y0 = e.selection[0][1],
                        y1 = e.selection[1][1];

                    // Select node from circle
                    this.svg.selectAll("circle")
                        .each(function (d: any) {
                            // Get the coordinates
                            var cx = d3.select(this).attr("cx");
                            var cy = d3.select(this).attr("cy");

                            // Check whether the coordinate is in our box.
                            var isSelected = x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
                            if (isSelected && !inst.brushedNodes.includes(d.id)) {
                                inst.brushedNodes.push(d.id)
                            }
                        });

                    // Select node from text.
                    this.svg.selectAll("text")
                        .each(function (d: any) {
                            // Get the x of the text
                            var cx = d3.select(this).attr("x");

                            // The Y of the text, is the Y of the translation.
                            var transform = d3.select(this).attr("transform");

                            // For some reason some of the text doesn't seem to have a transform, so for now we just ignore those.
                            // It seems like these are not part of the labels.
                            if (transform) {
                                var transString = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")) // Get the part between ()
                                    .split(","); // Split the x and y coordinate

                                // Parse the translation to numbers.
                                var cy = parseFloat(transString[1]);

                                // Check whether the real coordinate is in our box.
                                var isSelected = x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
                                if (isSelected && !inst.brushedNodes.includes(d.id)) {
                                    inst.brushedNodes.push(d.id)
                                }
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
        //const svg = d3.select("#arc-diagram")

        // Disable the brush
        this.svg.call(d3.brush().extent([[0, 0], [0, 0]]))
        this.svg.on(".brush", null);
        this.svg.selectAll("rect").remove();
    }

    //link colour based on sentiment of message
    linkColorHover(sentiment) {
        for (var s of sentiment) {
            if (s > 0.1) {
                return "#89ff89"; //#76ff76
            }
            if (s < -0.1) {
                return "#ffadad";
            }
        }

        return "#ccc";
    }

    linkColor(sentiment): string {
        // console.log(sentiment);
        for (var s of sentiment) {
            if (s > 0.1) {
                return "#3bff3b"; // #55EE55
            }

            if (s < -0.1) {
                return "#EE5555";
            }
        }

        return "#999999";
    }

    ngAfterViewInit(): void {
        this.runDiagram(this.data);
    }
}


