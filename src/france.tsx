import d3 from "./assets/d3";
import { useEffect, useRef } from "react";
import {Departement} from './assets/map'

interface prop{
    carte:Departement|null
}

export function Metropole(props: prop) {
    const ref = useRef<SVGSVGElement>(null);
  
    useEffect(() => {
      if (props.carte !== null) {
        const svg = d3.select(ref.current),
          width = +svg.attr("width"),
          height = +svg.attr("height");
        const projection = d3
          .geoMercator()
          .center([2.2522, 47.15]) // GPS of location to zoom on
          .scale(2000) // This is like the zoom
          .translate([width / 2, height / 2]);
        let data = props.carte;
        console.log("executed", data);
        // Draw the map
        console.log(data.features);
        let geoPath = d3.geoPath().projection(projection);
        const sphere = { type: "Sphere" };
        svg
          .append("g")
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("fill", "blue")
          .attr("d", (d: any) => geoPath(d));
      }
    }, [props.carte]);
  
    return(
    <div>
      <svg id="globe" ref={ref} width="800" height="600"></svg>
    </div>);
  }
  