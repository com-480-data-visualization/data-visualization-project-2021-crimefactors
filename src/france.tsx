import d3 from "./assets/d3";
import { useEffect, useRef } from "react";
import { Departement } from "./assets/map";

interface datapoint {
  code: string;
  value: number;
}

interface prop {
  carte: Departement | null;
  cwidth: number;
  cheight: number;
  data: Array<datapoint> | null;
}

export function Metropole(props: prop) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (props.carte !== null && props.data !== null) {
      const svg = d3.select(ref.current),
        width = 1760,
        height = 1320;

      let max = d3.max(props.data, (d) => d.value)!;

      let valueMap = new Map(props.data.map((d) => [d.code, d.value]))
      

      let colorScale = d3.scaleSequential(d3.interpolateOranges).domain([0, max]);
      const projection = d3
        .geoMercator()
        .center([2.2522, 47.15]) // GPS of location to zoom on
        .scale(4000) // This is like the zoom
        .translate([width / 2, height / 2]);
      let data = props.carte;
      console.log("executed", data);
      // Draw the map
      console.log(data.features);
      let geoPath = d3.geoPath().projection(projection);
      svg
        .append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", (d) => colorScale(valueMap.get(d.properties.code)!))
        .attr("d", (d: any) => geoPath(d));
    }
  }, [props.carte, props.data, props.cheight, props.cwidth]);

  return (
    <div>
      <svg
        id="globe"
        ref={ref}
        width={props.cwidth}
        height={props.cheight}
        viewBox="0 0 1760 1320"
      ></svg>
    </div>
  );
}
