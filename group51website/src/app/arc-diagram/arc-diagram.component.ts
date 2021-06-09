import { DataShareService } from './../data-share.service';
import { Subscription } from 'rxjs';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { jobs, nodeColor } from '../app.component';
//we need to import this component in the app.module.ts
//we need to add the line below to visualisation-page.component.html:
//<app-arc-diagram [file]="file"></app-arc-diagram>

@Component({
    selector: 'app-arc-diagram',
    templateUrl: './arc-diagram.component.html',
    styles: [
    ]
})
export class ArcDiagramComponent implements AfterViewInit, OnChanges {

    // Input variables.
    data: Data;
    @Input() sort;
    @Input() selectedNodeInfo;

    @Output() nodeEmailsEvent = new EventEmitter<Array<any>>();  // custom event updatting emails from clicked node to parent component

    private width;
    private height = 800;

    private datasubscription: Subscription;

    constructor() { }

    ngOnInit() {
        console.log("ArcDiagram: initialising: subbing to Service!")
        this.datasubscription = DataShareService.sdatasource.subscribe(newData => {
            console.log("ArcDiagram: Datashareservice: data update detected!");
            this.data = newData;
            this.initiateDiagram();
        })
    }

    // -- Button functions -- \\
    checkSortOption(event): void {
        // console.log(event.target);
        this.sort = event.target.value;
        this.initiateDiagram();
    }

    // -- --- -- \\

    ngOnChanges(changes: SimpleChanges): void {
        if ('selectedNodeInfo' in changes) {  //if a new node is selected then no need to refresh the whole graph
            console.log("ArcDiagram: The node selected is " + this.selectedNodeInfo['id'])
            this.newNodeSelected()
        } else {
            this.initiateDiagram()
        }
    }

    initiateDiagram() {
        if (this.container) {
            this.width = this.container.nativeElement.offsetWidth;
        }

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
        //console.log(nodes);
        const svg = d3.select("#arc-diagram")
            //.append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        //.append("g")
        //.attr("transform", "translate(0,50)");

        svg.selectAll("*").remove()

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

        var nodeRadius = 2;
        //add circles for the nodes
        svg.append("style").text(`

.hover path {
  stroke: #ccc;
}

.hover text {
  fill: #ccc;
} 

.hover mylabels.primary text {
  fill: black;
  font-weight: bold;
}

.hover mylabels.secondary text {
  fill: #333;
}

.hover path.primary {
  stroke: #333;
  stroke-opacity: 1;
}

`);
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

        function nodeGUI(inst, i) {
            var linklist = { "id": i.id, "job": i.job, "sendto": [], "receivedfrom": [], "mailCount": i.mailCount };

            console.log(linklist);
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
            //inst.nodeinfo = linklist;       // set local version
        }

        const node = svg.selectAll("mynodes")
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

        const label = svg.selectAll("mylabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("font-size", "8")
            .attr("font-family", "sans-serif")
            .attr("x", 12)
            .attr("transform", (d: any) => `translate(${0},${d.y = x(d.id) + nodeRadius + 1})`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            .on("click", (event, d: any) => {
                nodeGUI(inst, d)
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
                if (d.id != inst.selectedNodeInfo['id']) {
                    label.style('fill', "#000")
                    d3.select(this).style('fill', '#000')
                    d3.select(this).style('font-weight', 'normal')
                }
                link.style('stroke', (a: any) => inst.selectedNodeInfo['id'].length != 0 ? (a.source === inst.selectedNodeInfo['id'] || a.target === inst.selectedNodeInfo['id'] ? nodeColor(inst.selectedNodeInfo['job']) : inst.linkColorHover(a.sentiment)) : inst.linkColor(a.sentiment))
            })
            .call(mylabels => mylabels.append("text")
                .attr("x", 0)
                .attr("dy", "0.35em")
                .attr("fill", "#008000") //d3.lab(color(d.group)).darker(2)
                .text(d => makeText(d)));
        label.append("title")
            .text((d: any) => {
                return "id: " + d.id + "\n" +
                    "e-mail: " + d.address + "\n" +
                    "function: " + d.job;
            });
        /*const overlay = svg.append("g")
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

        const link = svg.selectAll('mylinks')
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
    }

    newNodeSelected() {

        const svg = d3.select("#arc-diagram")
        //const node = svg.selectAll("circle")
        const label = svg.selectAll("text")
        const link = svg.selectAll('path')

        //label.style('stroke', "#ccc")
        label.style('font-weight', (a: any) => a.id === this.selectedNodeInfo['id'] ? 'bold' : 'plain')
        label.style('fill', (a: any) => this.selectedNodeInfo['id'].length != 0 ? (a.id === this.selectedNodeInfo['id'] ? "#000" : '#ccc') : "#000")
        link.style('stroke', (a: any) => this.selectedNodeInfo['id'].length != 0 ? (a.source === this.selectedNodeInfo['id'] || a.target === this.selectedNodeInfo['id'] ? nodeColor(this.selectedNodeInfo['job']) : this.linkColorHover(a.sentiment)) : this.linkColor(a.sentiment))

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
        this.width = this.container.nativeElement.offsetWidth;
        this.runDiagram(this.data);
    }

    @ViewChild('container')
    container: ElementRef;

}


