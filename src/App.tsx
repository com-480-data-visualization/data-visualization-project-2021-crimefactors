import React, { useEffect, useState } from "react";
import { Departement } from "./assets/map";
import { Metropole } from "./france";
import { jStat } from "jstat";
import d3 from "./assets/d3";
import "./App.css";

interface dataPoint {
  code: string;
  value: number;
}

interface crimeDataPoint {
  code: string;
  value: number;
}

interface migrantDataPoint {
  code: string;
  value: number;
}

interface populationDataPoint {
  code: string;
  value: number;
}

function App() {
  const [map, setMap] = useState<Departement | null>(null);
  const [crime, setCrime] = useState<Array<crimeDataPoint> | null>(null);
  const [migrants, setMigrants] = useState<Array<migrantDataPoint> | null>(
    null
  );
  const [
    population,
    setPopulation,
  ] = useState<Array<populationDataPoint> | null>(null);
  const [adjusted, setAdjusted] = useState<Array<dataPoint> | null>(null);
  const [poverty, setPoverty] = useState<Array<dataPoint> | null>(null);

  const options = ["population", "immigration", "poverty"];

  useEffect(() => {
    fetch("departements.geojson")
      .then((response) => response.json())
      .then((response) => setMap(response))
      .catch((error) => console.log("error loading map", error));
  }, []);

  useEffect(() => {
    d3.csv("crime.csv").then((data) => {
      let crime = data.map((d) => ({
        code: d["Dep_number"]!,
        value: parseInt(d["crime"]!, 10),
      }));
      setCrime(crime);
    });
  }, []);

  useEffect(() => {
    d3.csv("immigration.csv").then((data) => {
      let migrants = data.map((d) => ({
        code: d["Dep_number"]!,
        value: Number(d["immigrants_n"]!),
      }));
      setMigrants(migrants);
    });
  }, []);

  useEffect(() => {
    d3.csv("population.csv").then((data) => {
      let population = data.map((d) => ({
        code: d["Dep_number"]!,
        value: Number(d["population"]!),
      }));
      setPopulation(population);
    });
  }, []);

  useEffect(() => {
    d3.csv("poverty.csv").then((data) => {
      let poverty = data.map((d) => ({
        code: d["Dep_number"]!,
        value: Number(d["All"]!),
      }));
      setPoverty(poverty);
    });
  }, []);

  const [checkboxes, setChecboxes] = useState<any>(
    options.reduce((state, option) => ({ ...state, [option]: false }), {})
  );
  console.log(checkboxes);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const option = e.target.name;
    console.log(checked);
    setChecboxes({ ...checkboxes, [option]: checked });
  };

  function Checkbox(option: string) {
    return (
      <div key={option}>
        <label>{option}</label>
        <input
          onChange={onChange}
          type="checkbox"
          checked={checkboxes[option]}
          name={option}
        ></input>
        {checkboxes[option]}
      </div>
    );
  }

  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    if (migrants && population && crime && poverty) {
      const b = crime
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      const sorted_population = population
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      const sorted_migrants = migrants
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      const sorted_poverty = poverty
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      console.log(b.length === sorted_migrants.length);
      console.log(b.length === sorted_population.length);
      console.log(b.length === sorted_poverty.length);

      let A = b.map((_v) => [1]);
      //"population", "immigration"
      if (checkboxes["population"]) {
        A.map((v, i) => v.push(sorted_population[i]));
        console.log("population", A);
      }
      if (checkboxes["immigration"]) {
        A.map((v, i) => v.push(sorted_migrants[i]));
      }
      if (checkboxes["poverty"]) {
        A.map((v, i) => v.push(sorted_poverty[i]));
      }
      console.clear();
      if (A[0].length >= 2) {
        const model = jStat.models.ols(b, A);
        setModel(model);
        console.log("model", model);
      } else {
        setModel(null);
      }
    }
  }, [population, migrants, crime, checkboxes, poverty]);
  useEffect(() => {
    if (model && crime) {
      console.log("model and population", model.resid, crime);
      setAdjusted(
        crime
          .sort((d1, d2) => d1.code.localeCompare(d2.code))
          .map((d, i) => ({ value: d.value + model.resid[i], code: d.code }))
      );
    } else if (crime) {
      setAdjusted(crime);
    }
  }, [model, crime]);

  //dndin
  /*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
  const [width, ] = useState(600);
  const [height, ] = useState(500);

  return (
    <div className="App">
      <p>
        We often two maps of France shown side by side as a political argument.
        However limiting ourselves to this limits our understanding. What if
        other factors are at play ?
      </p>
      <div className={"side_by_side"}>
        <div className={"section"}>
          <h1>Immigrant population</h1>
          <Metropole
            carte={map}
            cwidth={width}
            cheight={height}
            data={migrants}
          />
        </div>
        <div className={"section"}>
          <h1>Number of Crimes</h1>
          <Metropole carte={map} cwidth={width} cheight={height} data={crime} />
        </div>
      </div>
      <p>
        Looking at these maps we may arrive at the conclusion that immigrants
        are responsible for the crime in France. You wouldn't be the only one,
        as these maps are often used as an argument for reducing migration.
        However, correlation is not causation there may be hidden causes.
      </p>
      <p>
        Let's look at the most obvious one, population. If more people live in
        an area, there will probably be more migrants and more crime.
      </p>
      <div className={"center"}>
        <h1>Population</h1>
        <Metropole
          carte={map}
          cwidth={2 * width}
          cheight={2 * height}
          data={population}
        />
      </div>
      <p>
        Oh dear, we seem to be getting the same map over and over again. Is
        there no way to find what effect the different variables have on crime ?
      </p>
      <p>
        There is a solution linear regression{" "}
        <i>explain linear regression and why they are so awesome</i>
      </p>

      <div className={"side_by_side"}>
        <div className={"section"}>
          <p>
            R2 : {model && model.R2}, this number is the proportion of the
            variance in the crime that is predictable from the
            chosen factors. 
          </p>
          <p>
            The colorscale is changing otherwise a good part of the map would be
            not distinguishable
          </p>
          {Object.keys(checkboxes).map((option: string) => Checkbox(option))}
        </div>
        <div className={"section"}>
          <Metropole
            carte={map}
            cwidth={width}
            cheight={height}
            data={adjusted}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
