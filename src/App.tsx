import React, { useEffect, useState} from 'react';
import {Departement} from './assets/map'
import {Metropole} from './france'


function App() {
  const [map, setMap] = useState<Departement|null>(null);

  useEffect(() => {
    fetch("departements.geojson")
      .then((response) => response.json())
      .then((response) => setMap(response))
      .catch((error) => console.log("error loading map", error));
  }, [])


  return (
    <div className="App">
      <Metropole carte={map}/>
      
    </div>
  );
}

export default App;
