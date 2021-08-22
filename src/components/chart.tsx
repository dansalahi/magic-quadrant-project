import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {createUseStyles} from 'react-jss';
import {IChartProps} from '../types/chart';
import {IDataItem} from '../types/data';
import {ITheme} from '../types/theme';
import {useTheme} from 'react-jss';

const XAxisLabel = 'Completeness of vision →';
const YAxisLabel = 'Ability to execute →';

const margins = {
    left: 50,
    right: 0,
    top: 0,
    bottom: 50
};

const chartPosition = {
    x: 260,
    y: 515
};

const width = 400 + margins.left + margins.right;
const height = 400 + margins.top + margins.bottom;
const domainWidth = width - margins.left - margins.right;
const domainHeight = height - margins.top - margins.bottom;

export default function Chart(props: React.PropsWithChildren<IChartProps>) {
    const {data, editItemFull} = props;

    const chartRef = useRef(null);
    const classes = useStyles();
    const theme = useTheme<ITheme>();

    const initializeChart = () => {
        d3.select(chartRef.current).select('svg').remove();

        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margins.left},${margins.top})`);

        svg
            .append("rect")
            .attr('fill', 'none')
            .attr("stroke", theme.lightBlue)
            .attr("width", domainWidth)
            .attr("height", domainHeight / 2);

        svg
            .append("rect")
            .attr('fill', 'none')
            .attr("stroke", theme.lightBlue)
            .attr("width", domainWidth / 2)
            .attr("height", domainHeight);

        if(data){
            const x = d3
                .scaleLinear()
                .domain([0, 100])
                .range([0, domainWidth]);

            const y = d3
                .scaleLinear()
                .domain([0, 100])
                .range([domainHeight, 0]);

            svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${y.range()[0]})`);

            svg.append('g').attr('class', 'y axis');

            svg
                .append('text')
                .attr('fill', theme.darkGrey)
                .attr('text-anchor', 'start')
                .attr('x', 0)
                .attr('y', height - 30)
                .text(XAxisLabel);

            svg
                .append('text')
                .attr('fill', theme.darkGrey)
                .attr('text-anchor', 'start')
                .attr('x', height * -1 + margins.bottom + margins.top)
                .attr('y', -10)
                .attr('transform', 'rotate(-90)')
                .text(YAxisLabel);

            let xAxis = d3.axisBottom(x).tickSize(0).tickValues([]);
            let yAxis = d3.axisLeft(y).tickSize(0).tickValues([]);

            // @ts-ignore
            svg.selectAll('g.y.axis').call(yAxis).attr('stroke-width', '2px');
            // @ts-ignore
            svg.selectAll('g.x.axis').call(xAxis).attr('stroke-width', '2px');

            const item = svg.selectAll('g.node').data(data.map((dataItem, index) => {
                return {...dataItem, index};
            }));

            let topAxis = d3.axisTop(x).tickSize(0).tickValues([]);
            svg
                .append('g')
                .attr('stroke-width', '2px')
                .call(topAxis);

            let rightAxis = d3.axisRight(y).tickSize(0).tickValues([]);
            svg
                .append('g')
                .attr('transform', `translate(${width - margins.left - 1}, 0)`)
                .attr('stroke-width', '2px')
                .call(rightAxis);

            const itemGroup = item
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('data-vision', (d) => {
                    return d.vision;
                })
                .attr('data-ability', (d) => {
                    return d.ability;
                })
                .attr('transform', (d) => {
                    return `translate(${x(d.vision)}, ${y(d.ability)})`
                });

            itemGroup
                .append('circle')
                .attr('r', 15)
                .attr('class', 'dot')
                .style('fill', theme.blue)
                .append('title')
                .text((d) => {
                    return d.label;
                });

            itemGroup
                .append('text')
                .text((d) => d.label)
                .attr('transform', (d) => {
                    return `translate(5, 30)`
                })
                .attr('fill', theme.blue)
                .attr('font-family', 'sans-serif')
                .attr('font-size', '13px');

            const dragHandler = d3.drag<SVGCircleElement, IDataItem>()
                .on('drag', function (event) {
                    d3.select(this).attr('cx', event.x).attr('cy', event.y);
                    let newItem = {...event.subject};
                    newItem.vision = Math.floor((event.x - chartPosition.x) / domainWidth * 100);
                    newItem.ability = Math.floor((chartPosition.y - event.y) / domainHeight * 100);
                    delete newItem.index;
                    editItemFull(event.subject.index, newItem);
                });

            dragHandler(svg.selectAll('circle'));
        }
    }

    useEffect(initializeChart, [data]);

    return (
        <div className={classes.chartContainer}>
            {data &&
                <>
                    <div ref={chartRef}/>
                    <div className="quadrant-title" id="challenger">
                        Challengers
                    </div>
                    <div className="quadrant-title" id="leader">
                        Leaders
                    </div>
                    <div className="quadrant-title" id="niche">
                        Niche Players
                    </div>
                    <div className="quadrant-title" id="visionaries">
                        Visionaries
                    </div>
                </>

            }
        </div>
    );
}

const useStyles = createUseStyles((theme: ITheme) => ({
    chartContainer: {
        position: 'relative',
        '& .quadrant-title': {
            position: 'absolute',
            background: theme.grayTransparent,
            color: 'white',
            borderRadius: '5px',
            padding: '0.1rem 1rem',
            opacity: '0.5',
            fontSize: '0.7rem'
        },
        '& #challenger': {
            position: 'absolute',
            top: `${margins.top + 8}px`,
            left: `${width / 4}px`,
        },
        '& #leader': {
            position: 'absolute',
            top: `${margins.top + 8}px`,
            left: `${width / 4 * 3}px`,
            transform: 'translateX(-50%)'
        },
        '& #niche': {
            position: 'absolute',
            top: `${height - margins.bottom - 25}px`,
            left: `${width / 4}px`,
        },
        '& #visionaries': {
            position: 'absolute',
            top: `${height - margins.bottom - 25}px`,
            left: `${width / 4 * 3}px`,
            transform: 'translateX(-50%)'
        }
    }
}));