import { DataShareService } from './../data-share.service';
import { Subscription } from 'rxjs';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { globalBrushDisable, jobs, nodeColor } from '../app.component';
import { ResizedEvent } from 'angular-resize-event';

@Component({
    selector: 'app-treemap',
    templateUrl: './treemap.component.html',
    styleUrls: ['./treemap.component.css']
})


/** following documentation and examples from:
 * D3 official examples site - simple treemap:  https://www.d3-graph-gallery.com/graph/treemap_basic.html 
 * D3 hierarchy documentaiton on Observable:    https://observablehq.com/@d3/d3-hierarchy 
 */
export class TreemapComponent implements OnInit {

    // -- Properties
    public margin = { top: 10, right: 10, bottom: 10, left: 10 } // px
    public padding = 20; // px
    public width: number = 1000; // px
    public height: number = 800;  // px

    // -- Input
    data: Data;

    // -- Output
    @Output() nodeEmailsEvent = new EventEmitter<Array<any>>();

    // -- Private variables
    private svg;
    private datasubscription: Subscription;
    private groupedByJob = true;
    private valueOption = "both";
    private selectedNodeId = -1;

    // compute actual constant values of properties
    constructor() {
    }

    // set width etc on loading
    ngOnInit(): void {
        this.svg = d3.select("#tree_map_d3")

        //console.log("TreeMap: initialising: subbing to Service!")
        this.datasubscription = DataShareService.sdatasource.subscribe(newData => {
            //console.log("TreeMap: Datashareservice: data update detected!");
            this.data = newData;
            this.buildGraph(this.data);
        })
    }

    ngOnDestroy(): void {
        this.datasubscription.unsubscribe();
    }

    // Make sure the width is updated on resize.
    onResized(event: ResizedEvent) {
        this.width = event.newWidth;
        this.height = event.newHeight;

        // set the width and height of the element (account for margins)
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)

        this.buildGraph(this.data);
    }

    // -- GRAPH CREATION FUNCTIONS --------------------------------------------------- -- \\

    // create child-elements, compute their position, sizes, etc...
    buildGraph(data): void {
        let inst = this;

        // Reset the treemap.
        this.svg.selectAll("*").remove();

        // get the data into a usable format
        // ^ this is not really about the format, 
        // but this is apparently how you copy arrays in JavaScript/TypeScript.
        // This was necessary because these are passed by reference, so if they would be changed here,
        // they would also be changed in the other components. Don't worry about performance, copying only takes 2-3ms.
        // - Kay
        //let links = JSON.parse(JSON.stringify(this.data.groupedLinks))
        let nodes = JSON.parse(JSON.stringify(this.data.nodes))

        // If there are no nodes, don't build the graph.
        if (nodes.length == 0) {
            return;
        }

        // Root node.
        let jsonTree = {
            "children": [],
            "name": "Company",
        }

        if (this.groupedByJob) {

            // Second layer of the tree; the job functions.
            for (const job of jobs) {
                jsonTree["children"].push({
                    "name": job,
                    "children": [],
                    //"colname": "level2",
                })
            }
        }

        // Add all the leaves i.e. the people, also keep track of the most e-mails send/received.
        let maxMails = 0;
        for (const node of nodes) {
            let value = 0;
            if (this.valueOption == "both")
                value = node.mailCount.toString();
            else if (this.valueOption == "sent")
                value = node.mailSent.toString();
            else if (this.valueOption == "received")
                value = node.mailReceived.toString();

            maxMails = Math.max(value, maxMails);

            if (this.groupedByJob) {

                for (var j of jsonTree["children"]) {
                    if (j["name"] == node.job) {

                        j["children"].push({
                            "id": node.id.toString(),
                            "value": value,
                            //"colname": "level3",
                            "job": node.job
                        })
                    }
                }
            } else {
                jsonTree["children"].push(
                    {
                        "id": node.id.toString(),
                        "value": value,
                        //"colname": "level3",
                        "job": node.job
                    }
                )
            }
        }

        // Then d3.treemap computes the position of each element of the hierarchy
        const hierarchy = d3.hierarchy(jsonTree)
            .sum(d => d['value'])
            .sort((a, b) => b.value - a.value)

        // Settings for the treemap
        let padding = 5;
        const treemap = d3.treemap()
            .size([this.width, this.height])
            .padding(padding)
            .paddingTop(3 * padding)

        // Give the treemap the data.
        treemap(hierarchy)

        //console.log(hierarchy)
        // Create an opacity scale based on mails sent/received.
        var opacity = d3.scaleLinear()
            .domain([0, maxMails])
            .range([.5, 1])

        // Create the blocks for every leaf
        let block = this.svg.selectAll("g")
            .data(hierarchy.leaves())
            .enter()
            .append("g")
            .attr("transform", (d: any) => `translate(${d['x0']}, ${d['y0']})`)

        // Create the rectangle.
        block.append('rect')
            .attr("class", "tile")
            .attr("fill", (d: any) => nodeColor(d['data']['job']))
            .attr("opacity", (d: any) => opacity(d['data']['value']))
            .attr("width", (d: any) => d['x1'] - d['x0'])
            .attr("height", (d: any) => d['y1'] - d['y0'])
            .append("title")
            .text((d: any) => {
                return "Id: " + d['data']['id'] + "\n" +
                    "Value: " + d['data']['value'] + "\n" +
                    "Job: " + d['data']['job'];
            })

        block.on("click", (event, d: any) => {
            console.log("Clicked treemap!");
            if (d['data']['id'] == inst.selectedNodeId) {
                inst.selectedNodeId = -1;
                DataShareService.updateServiceNodeSelected({});
            } else {
                let node = nodes.filter(e => e.id == d['data']['id']);
                console.log(node);
                inst.selectedNodeId = d['data']['id'];
                nodeGUI(node[0]);
            }

            newBlockSelected();
        })

        let foundSelectedNode = false;
        block.each((d: any) => {
            if (d.id == inst.selectedNodeId) {
                foundSelectedNode = true;
                nodeGUI(d.data);
            }
        })

        let node = nodes.filter(e => e.id == inst.selectedNodeId);
        if (node.length == 1) {
            console.log()
            nodeGUI(node[0])
        } else {
            this.selectedNodeId = -1;
            DataShareService.updateServiceNodeSelected({});
        }
        newBlockSelected();

        // Add the Id to the rectangle if there is enough space.
        this.svg
            .selectAll("text")
            .data(hierarchy.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + padding })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + padding * 3 })    // +20 to adjust position (lower)
            .text(function (d) {
                if ((Math.abs(d['x1'] - d['x0']) > 55) &&
                    (Math.abs(d['y1'] - d['y0']) > 15)) {
                    return "Id: " + d.data.id
                }
                return ""
            })
            .attr("font-size", "14px")
            .attr("fill", "white")

        // Add the amount of mails to the rectangle if there is enough space.
        this.svg
            .selectAll("vals")
            .data(hierarchy.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + padding })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + padding * 6 })    // +20 to adjust position (lower)
            .text(function (d) {
                if ((Math.abs(d['x1'] - d['x0']) > 55) &&
                    (Math.abs(d['y1'] - d['y0']) > 40)) {
                    return "Mails: " + d.data.value
                }
                return ""
            })
            .attr("font-size", "11px")
            .attr("fill", "white")

        // Add title for the job functions
        if (this.groupedByJob) {
            this.svg
                .selectAll("titles")
                .data(hierarchy.descendants().filter(function (d) { return d.depth == 1 }))
                .enter()
                .append("text")
                .attr("x", function (d) { return d.x0 + padding })
                .attr("y", function (d) { return d.y0 + padding })
                .text(function (d) {
                    if (d['x1'] - d['x0'] > d['data']['name'].length * 8) {
                        return d['data']['name']
                    }
                    return ""
                })
                .attr("font-size", "14px")
                .attr("fill", function (d) { return nodeColor(d.data.name) })
        }

        function nodeGUI(i) {
            console.log(i);

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

            if (inst.selectedNodeId === -1) {
                for (var member in linklist) delete linklist[member];
            }

            DataShareService.updateServiceNodeSelected(linklist); // send lists of email senders/receivers to service
        }

        function newBlockSelected() {
            let block = inst.svg.selectAll("g");
            block.style("stroke", "black")
                .style("stroke-width", (d: any) => (d.data.id == inst.selectedNodeId) ? 5 : 0)
        }
    }

    checkGroupOption(event) {
        this.groupedByJob = event.target.checked;
        globalBrushDisable();
        this.buildGraph(this.data);
    }

    checkValueOption(event) {
        this.valueOption = event.target.value;
        globalBrushDisable();
        this.buildGraph(this.data);
    }
}
