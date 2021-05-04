import { Component, OnInit, Input, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-barchart',
    templateUrl: './barchart.component.html',
    styleUrls: ['./barchart.component.css']
})

export class BarchartComponent implements OnInit, OnChanges {

    private data = [
        { "Id": "0", "Month": "Jan", "Mails": 0 },
        { "Id": "1", "Month": "Feb", "Mails": 0 },
        { "Id": "2", "Month": "Mar", "Mails": 0 },
        { "Id": "3", "Month": "Apr", "Mails": 0 },
        { "Id": "4", "Month": "May", "Mails": 0 },
        { "Id": "5", "Month": "Jun", "Mails": 0 },
        { "Id": "6", "Month": "Jul", "Mails": 0 },
        { "Id": "7", "Month": "Aug", "Mails": 0 },
        { "Id": "8", "Month": "Sep", "Mails": 0 },
        { "Id": "9", "Month": "Oct", "Mails": 0 },
        { "Id": "10", "Month": "Nov", "Mails": 0 },
        { "Id": "11", "Month": "Dec", "Mails": 0 },
    ];

    private colors = [
        "#fa982f",
        "#29dae3",
        "#e33929",
        "#48e329",
        "#e029e3",
        "#e3dd29",
    ]

    private container;
    private chart;
    private marginTop = 20;
    private marginBot = 10;
    private width = 600;
    private height = 800 - this.marginTop - this.marginBot;

    private selectedData = this.data;
    private unselectedIds = [];

    @Input() file;

    constructor() { }

    ngOnInit(): void {
        this.createSvg();
        this.drawBars();
        this.handleInput();
    }

    ngOnChanges(changes: SimpleChanges): void {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            // By lines
            var lines = fileReader.result.toString().split('\n');
            for (var line = 1; line < lines.length; line++) {
                let monthStr = lines[line].substring(5, 7);
                let monthNum = parseInt(monthStr);
                // console.log(monthNum);
                this.data[monthNum - 1].Mails += 1;
            }

            this.drawBars();

        }
        fileReader.readAsText(this.file);
    }

    private createSvg(): void {
        this.container = d3.select("svg")
            .attr("width", this.width)
            .attr("height", this.height + this.marginTop + this.marginBot);
    }

    private drawBars(): void {
        this.container.selectAll('g').remove();
        this.chart = this.container.append('g');

        // Create the X-axis band scale
        const x = d3.scaleBand()
            .range([0, this.width])
            .domain(this.selectedData.map(d => d.Month))
            .padding(0.1);

        // Draw the X-axis on the DOM
        this.chart.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0))
        // .attr('color')

        // Create the Y-axis band scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(this.selectedData, d => d.Mails) + 300])
            .range([this.height, 0]);

        this.chart.selectAll('bars')
            .remove();

        // Create and fill the bars
        this.chart.selectAll("bars")
            .data(this.selectedData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.Month))
            .attr("y", d => y(d.Mails))
            .attr("width", x.bandwidth())
            .attr("height", (d) => this.height - y(d.Mails))
            .attr("fill", d => this.colors[d.Id % this.colors.length]);

        this.chart.selectAll('label')
            .remove();

        this.chart.selectAll('label')
            .data(this.selectedData)
            .enter()
            .append('text')
            .text(d => d.Mails)
            .attr('x', d => x(d.Month) + x.bandwidth() / 2)
            .attr('y', d => y(d.Mails) - 20)
            .attr("text-anchor", "middle")
            .classed("label", true);
    }

    private handleInput(): void {
        const listItems = d3.select("ul")
            .selectAll("li")
            .data(this.data)
            .enter()
            .append("li")
            .attr("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.25)")
            .attr("margin-bottom", "1rem")
            .attr("padding", "1rem")
            .attr("width", "10rem")
            .attr("display", "flex")
            .attr("justify-content", "space-between")
            .attr("align-items", "center")
            .attr("font-weight", "bold");


        listItems.append('span').text(d => d.Month);

        listItems.append('input')
            .attr('type', 'checkbox')
            .attr('checked', true)
            .attr('id', d => d.Id)
            .on('change', (event) => {
                if (this.unselectedIds.indexOf(event.target.id) === -1) {
                    this.unselectedIds.push(event.target.id);
                } else {
                    this.unselectedIds = this.unselectedIds.filter((id) => id != event.target.id);
                }

                this.selectedData = this.data.filter(
                    (d) => this.unselectedIds.indexOf(d.Id) === -1
                );

                this.drawBars();
            });
    }
}
