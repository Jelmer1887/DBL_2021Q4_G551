let DATA = [
    { id: '1', value: 0, month: 'January' },
    { id: '2', value: 0, month: 'February' },
    { id: '3', value: 0, month: 'March' },
    { id: '4', value: 0, month: 'April' },
    { id: '5', value: 0, month: 'May' },
    { id: '6', value: 0, month: 'June' },
    { id: '7', value: 0, month: 'July' },
    { id: '8', value: 0, month: 'August' },
    { id: '9', value: 0, month: 'September' },
    { id: '10', value: 0, month: 'October' },
    { id: '11', value: 0, month: 'November' },
    { id: '12', value: 0, month: 'December' },
];

const COLORS = [
    '#fa982f',
    '#29dae3',
    '#e33929',
    '#48e329',
    '#e029e3',
    '#e3dd29'
]

const MARGINS = { top: 20, bottom: 10 };
const CHART_WIDTH = 600;
const CHART_HEIGHT = 800 - MARGINS.top - MARGINS.bottom;

let selectedData = DATA;

function renderChart() {
    const xScale = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const yScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    xScale.domain(selectedData.map(data => data.month));
    yScale.domain([0, d3.max(selectedData, d => d.value) + 500]);

    const container = d3.select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

    container.selectAll('g')
        .remove();

    const chart = container.append('g')

    chart.append('g')
        .call(d3.axisBottom(xScale).tickSizeOuter(0))
        .attr('transform', `translate(0, ${CHART_HEIGHT})`)
        .attr('color', '#000000');

    chart.selectAll('.bar')
        .remove();

    chart.selectAll('.bar')
        .data(selectedData, data => data.id)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('fill', data => COLORS[parseInt(data.id) % 6])
        .attr('width', xScale.bandwidth())
        .attr('height', data => CHART_HEIGHT - yScale(data.value))
        .attr('x', data => xScale(data.month))
        .attr('y', data => yScale(data.value));


    chart.selectAll('.label')
        .remove();

    chart.selectAll('.label')
        .data(selectedData, data => data.id)
        .enter()
        .append('text')
        .text(data => data.value)
        .attr('x', data => xScale(data.month) + xScale.bandwidth() / 2)
        .attr('y', data => yScale(data.value) - 20)
        .attr('text-anchor', 'middle')
        .classed('label', true);
}

renderChart();

let unselectedIds = [];

const listItems = d3.select('#data')
    .select('ul')
    .selectAll('li')
    .data(DATA)
    .enter()
    .append('li');

listItems.append('span').text(data => data.month);

listItems.append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .attr('id', data => data.id)
    .on('change', (event) => {
        if (unselectedIds.indexOf(event.target.id) === -1) {
            unselectedIds.push(event.target.id);
        } else {
            unselectedIds = unselectedIds.filter((id) => id !== event.target.id);
        }

        selectedData = DATA.filter(
            (d) => unselectedIds.indexOf(d.id) === -1
        );

        renderChart();
    });

document.getElementById('file').onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        // By lines
        var lines = this.result.split('\n');
        for (var line = 1; line < lines.length; line++) {
            let monthStr = lines[line].substring(5, 7);
            let monthNum = parseInt(monthStr);
            // console.log(monthNum);
            DATA[monthNum - 1].value += 1;
        }
    };
    reader.readAsText(file);

    selectedData = DATA;
    renderChart();
};