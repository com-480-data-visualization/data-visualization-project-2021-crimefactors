import { geoEqualEarth, geoPath, geoContains } from "d3-geo";
import {
  json,
  select,
  csv,
  tsv,
  dsv,
  geoMercator,
  scaleQuantile,
  schemeBlues,
  max,
  interpolatePiYG,
  interpolateOranges,
  scaleSequential,
  scaleLinear,
  range,
} from "d3";

const d3 = {
  geoEqualEarth,
  geoMercator,
  geoContains,
  schemeBlues,
  scaleSequential,
  scaleLinear,
  interpolatePiYG,
  interpolateOranges,
  scaleQuantile,
  geoPath,
  csv,
  tsv,
  max,
  range,
  dsv,
  json,
  select,
};

export default d3;