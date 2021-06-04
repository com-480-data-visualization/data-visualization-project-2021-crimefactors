import { useMemo } from "react";
import d3 from "./assets/d3";
import { Departement } from "./assets/map";

interface datapoint {
  code: string;
  value: number;
}

interface prop {
  carte: Departement;
  cwidth: number;
  cheight: number;
  setSelected: any;
  data: Array<datapoint>;
}

export function Metropole2(props: prop) {
  const width = 1760,
    height = 1320;
  let max = d3.max(props.data, (d) => d.value)!;
  let valueMap = new Map(props.data.map((d) => [d.code, d.value]));
  let colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, max]);
  const projection = useMemo(() =>d3
    .geoMercator()
    .center([2.2522, 47.15]) // GPS of location to zoom on
    .scale(4000) // This is like the zoom
    .translate([width / 2, height / 2]),[height, width]);
  let data = props.carte;
  let geoPath = useMemo(() => d3.geoPath().projection(projection), [projection]);

  return (
    <div>
      <svg
        id="globe"
        width={props.cwidth}
        height={props.cheight}
        viewBox={`0 0 ${width} ${height}`}
      >
        {data.features.map((d: any) => (
          <path
            d={geoPath(d)!}
            style={{ fill: colorScale(valueMap.get(d.properties.code)!) }}
            onMouseLeave={() => props.setSelected(null)}
            onMouseEnter={() => props.setSelected(d.properties.code)}
          ></path>
        ))}
      </svg>
    </div>
  );
}
