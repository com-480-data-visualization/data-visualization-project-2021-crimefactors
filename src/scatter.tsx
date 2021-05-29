import d3 from "./assets/d3";
import { useEffect, useRef } from "react";

interface datapoint {
  code: string;
  value: number;
}

interface prop {
  cwidth: number;
  cheight: number;
  data: Array<datapoint> | null;
  crime: Array<datapoint> | null;
}

var margin = { top: 10, right: 0, bottom: 0, left: 10 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

export function ScatterPlot(props: prop) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (props.crime && props.data) {
      const svg = d3.select(ref.current);

      svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let data = props.crime.map((d, i) => ({
        crime: d.value,
        factor: props.data![i].value,
      }));
      //X axis
      var x = d3
        .scaleLinear()
        .domain([0, d3.max(props.data, (d) => d.value)!])
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

      // Add Y axis
      var y = d3
        .scaleLinear()
        .domain([0, d3.max(props.crime, (d) => d.value)!])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y).ticks(5));

      // Add dots
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.factor);
        })
        .attr("cy", function (d) {
          return y(d.crime);
        })
        .attr("r", 1.5)
        .style("fill", "#69b3a2");
    }
  }, [props.crime, props.data]);

  return (
    <div>
      <svg
        id="globe"
        ref={ref}
        width={props.cwidth}
        height={props.cheight}
        viewBox={`0 0 ${height + margin.top + margin.bottom} ${
          width + margin.left + margin.right
        } `}
      ></svg>
    </div>
  );
}
