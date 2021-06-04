import React, { useEffect, useMemo, useState } from "react";
import { Departement } from "./assets/map";
import { Metropole } from "./france";
import { Metropole2 } from "./france2";
import { ScatterPlot } from "./scatter";
import { jStat } from "jstat";
import d3 from "./assets/d3";
import "./App.css";
import { Adjusted } from "./adjusted";
import { color } from "d3-color";

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
  const [migrants, setMigrants] =
    useState<Array<migrantDataPoint> | null>(null);
  const [population, setPopulation] =
    useState<Array<populationDataPoint> | null>(null);
  const [adjusted, setAdjusted] = useState<Array<dataPoint> | null>(null);
  const [poverty, setPoverty] = useState<Array<dataPoint> | null>(null);
  const [bac, setBac] = useState<Array<dataPoint> | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  

  const [complet, setComplet] = useState<d3.DSVRowArray<string> | null>(null);
  let finalOptionMap: Map<string, Array<dataPoint>> | null = useMemo(() => {
    if (complet && poverty && migrants) {
      let temp = new Map();
      temp.set(
        "Population 2017",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["P17_POP"]!, 10),
        }))
      );
      temp.set(
        "Population 2012",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["P12_POP"]!, 10),
        }))
      );
      temp.set(
        "Population 2007",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["P07_POP"]!, 10),
        }))
      );
      temp.set(
        "Superfecy",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["SUPERF"]!, 10),
        }))
      );
      temp.set(
        "Population density 2017",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["P17_POP"]!, 10) / parseInt(d["SUPERF"]!, 10),
        }))
      );
      temp.set(
        "Population density 2012",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["P12_POP"]!, 10) / parseInt(d["SUPERF"]!, 10),
        }))
      );
      temp.set(
        "Population density 2007",
        complet.map((d) => ({
          code: d["DEPARTEMENT"]!,
          value: parseInt(d["P07_POP"]!, 10) / parseInt(d["SUPERF"]!, 10),
        }))
      );
      temp.set(
        "Poverty rate 2017",
        poverty
      );
      temp.set("Taux d'activité 2007", complet.map((d) => ({
        code: d["DEPARTEMENT"]!,
        value: parseInt(d["C07_ACT1564"]!, 10) / parseInt(d["P07_POP"]!, 10),
      })))

      temp.set("Taux de chomage 2007", complet.map((d) => ({
        code: d["DEPARTEMENT"]!,
        value: parseInt(d["P07_HCHOM1564"]!, 10) / parseInt(d["P07_POP"]!, 10),
      })))

      temp.set("Taux d'immigration", migrants.map((d, i) => ({code:d.code, value : complet[i][""]})))

      
      

      complet.map((d) => console.log(d));
      console.log("finished", temp);
      return temp;
    } else {
      return null;
    }
  }, [complet, poverty, migrants]);

  const options = ["population", "immigration", "poverty", "school success", "unemployed"];

  let optionMap = new Map();
  optionMap.set("population", population);
  optionMap.set("immigration", migrants);
  optionMap.set("poverty", poverty);
  optionMap.set("school success", bac);
  if (finalOptionMap){
    optionMap.set("unemployed", finalOptionMap.get("Taux de chomage 2007"))
  }
  

  
  console.log("test");

  useEffect(() => {
    d3.csv("complet.csv").then((data) => {
      setComplet(data);
    });
  }, []);

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
    d3.csv("bac.csv").then((data) => {
      let bac = data.map((d) => ({
        code: d["Dep_number"]!,
        value: Number(d["General_success"]!),
      }));
      setBac(bac);
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
    if (migrants && population && crime && poverty && bac) {
      const sorted_population = population
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      const b = crime
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d, i) => d.value / sorted_population[i]);
      const sorted_migrants = migrants
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d, i) => d.value / sorted_population[i]);
      const sorted_poverty = poverty
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      const sorted_bac = bac
        .sort((d1, d2) => d1.code.localeCompare(d2.code))
        .map((d) => d.value);
      console.log("testing lengths");
      console.log(b.length === sorted_migrants.length);
      console.log(b.length === sorted_population.length);
      console.log(b.length === sorted_bac.length);

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
      if (checkboxes["school success"]) {
        A.map((v, i) => v.push(sorted_bac[i]));
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
  }, [population, migrants, crime, checkboxes, poverty, bac]);
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

  const [width] = useState(600);
  const [height] = useState(500);

  const [scatterPlotSelection, setScatterPlotSelection] = useState(options[0]);
  const scatterPlotData = optionMap.get(scatterPlotSelection);

  return (
    <div className="App">
      <h1>
 
        CRIME in FRANCE
      
      </h1>
      <h2>
        What factors determine and influence crime rates in the French nation?
      </h2> 
      <p>
        As a political argument, often these two maps are shown next to each other to limit immigration, arguing that immigrants
        are responsible for the crime in France. Hover over the Immigration map to find out the department number for each section on the map. 
      </p>
     
      <div className={"side_by_side"}>
        <div className={"section"}>
          <h3>Immigrant population</h3>
          <p>
            Department number = {selected}
          </p>
          {map && migrants && (
            <Metropole2
              carte={map}
              cwidth={width}
              cheight={height}
              data={migrants}
              setSelected={setSelected}
            />
          )}
        </div>
        <div className={"section"}>
          <h3>Number of Crimes</h3>
          <Metropole carte={map} cwidth={width} cheight={height} data={crime}  />
        </div>
      </div>
      <p>
        However, what if other factors come into play?
        Correlation is not causation and there might be hidden causes...
      </p>
      <p>
        The most obvious other paramter that can be used as a counter-argument is POPULATION. 
        When the population density is higher, there are higher chances of having people who live in precarious conditions, and are therefore more likely to commit crimes.

      </p>
      <div className={"center"}>
        <h3>Population</h3>
        <Metropole
          carte={map}
          cwidth={1 * width}
          cheight={1 * height}
          data={population}
        />
      </div>
      <p>
        We investigate the influence that poverty, unemployment and education have on crime rates within different departments. <i>Linear regression</i> is performed on the data, collected from
        the official INSEE (The National Institute of Statistics and Economic Studies) website, to show the correlation between crime and other factors. 
        The proportion of the variance in crime rate that is predictable from the chosen factors is investigated. 

      </p>
      

      <div className={"center"}>
        <div className={"section"}>
          
          {/* <p>The colorscale is changing.</p> */}

          <p></p>

          {Object.keys(checkboxes).map((option: string) => Checkbox(option))}
        </div>
        <h4>
          The ratio of crime <i>variance</i> predicted by the factor you just selected is: {model && model.R2} 
        </h4>
        <div className={"section"}>
          {map && adjusted && crime && <Adjusted
            carte={map}
            cwidth={1.5* width}
            cheight={1.5* height}
            data={adjusted}
            fixedData={crime}
            setSelected={setSelected}
          />}
        </div>
      </div>

      <p>
        Another way of representing how strictly correlated crime rates are with other factors (education, immigration, poverty, unemployment) is via an interactive <i>scatter plot</i>. 
        Here each dot represents a department, and the y axis is stabilized on the crime. 

        Department number 1 is Ain, departemnt number 95 is Val-d'Oise. 

        The biggest cities are the following, with the corresponding departments:

        <ul>
          <li>Paris, 75</li>
          <li>Lyon, 69</li>
          <li>Marseille, 13</li>
          <li>Toulouse, 31</li>
          <li>Bordeaux, 33 </li>
          <li>Nice, 06</li>
        </ul>

        It is evident from the plot how unemployment rate is, for example, another factor stricty correlated to crime rate in France.
      </p>

      <div className={"center"}>
        <div className={"section"}>

        <div className={"section"}>
          <select
            value={scatterPlotSelection}
            onChange={(e) => {
              setScatterPlotSelection(e.target.value);
            }}
          >
            {options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

          {crime && scatterPlotData && (
            <ScatterPlot
              cwidth={1.5*width}
              cheight={1.5*height}
              crime={crime}
              data={scatterPlotData}
            />
          )}
        </div>
        
      </div>
    
    </div>
  );
}

export default App;
