import { useState } from "react";
import d3 from "./assets/d3";

interface datapoint {
  code: string;
  value: number;
}

interface prop {
  cwidth: number;
  cheight: number;
  data: Array<datapoint>;
  crime: Array<datapoint>;
}

var margin = { top: 10, right: 0, bottom: 0, left: 10 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const Axis = (props: { axisCreator: d3.Axis<d3.NumberValue> }) => {
  const axisRef = (axis: any) => {
    axis && props.axisCreator(d3.select(axis));
  };

  return <g ref={axisRef} />;
};

export function ScatterPlot(props: prop) {
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d) => d.value)!])
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(props.crime, (d) => d.value)!])
    .range([height, 0]);

  let data = props.crime.map((d, i) => ({
    code: d.code,
    crime: d.value,
    factor: props.data![i].value,
  }));

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <svg
        id="globe"
        width={props.cwidth}
        height={props.cheight}
        viewBox={`0 0 ${height + margin.top + margin.bottom} ${
          width + margin.left + margin.right
        } `}
      >
        <g transform={`translate(${[margin.left, margin.top].join(",")})`}></g>
        <g transform={`translate(${[0, height].join(",")})`}>
          <Axis axisCreator={d3.axisBottom(x).ticks(5)}></Axis>
        </g>
        <text>Test</text>
        <Axis axisCreator={d3.axisLeft(y).ticks(5)}></Axis>
        <g>
          {data.map((d) => {
            return (
              <g>
                {selected===d.code && (
                  <text x={x(d.factor)} y={y(d.crime)}>
                    {d.code}
                  </text>
                )}
                <circle
                  cx={x(d.factor)}
                  cy={y(d.crime)}
                  r={3}
                  style={{
                    fill: `hsl(270, 100%,50%)`,
                    transition: "fill 2s",
                  }}
                  onMouseOver={() => setSelected(d.code)}
                  onMouseLeave={() => setSelected(null)}
                  onClick={() => alert(d.code)}
                ></circle>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
