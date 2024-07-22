import { FormControl,Select,MenuItem, Card, CardContent  } from '@mui/material';
import React, { useState, useEffect } from 'react'
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './table';
import { sortData,formatprint } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const  [countries, setCountries]=useState([]);
  const  [Country, setCountry]=useState("ww");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setmapCountries]=useState([]);
  const [casesType, setCasesType] = useState("cases");
  // const [vaccines, setvaccines]=useState([]);;

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  }, [])

  // useEffect(()=>{
  //   fetch("https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=180")
  //   .then(response=>response.json())
  //   .then(data=>{
  //     setvaccines(data);
  //   })
  // }, [])
  
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData=sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setmapCountries(data);
        });
    };
    
    getCountriesData();
  }, []);

  const onCountryChange= async (event) => {
    const countryCode=event.target.value;

    const url = countryCode === "ww" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

    })
    
    console.log("kek",countryInfo,countryCode);
    setCountry(countryCode);
  }


  return (
    <div className="app">
      <div className="app_left">
      <div className="App-header">
        <h1>Covid-19 Tracker.</h1>
        <FormControl className="dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={Country}>
            <MenuItem value="ww">All</MenuItem>
           { countries.map((country)=>(<MenuItem value={country.value}>{country.name}</MenuItem>))
            }
         </Select>
        </FormControl>
      </div>
      
      <div className="stats">
            <InfoBox active ={casesType==="cases"} click={(f)=>setCasesType("cases")} title="Cases" cases={formatprint(countryInfo.todayCases)} total={formatprint(countryInfo.cases)}/>

            <InfoBox active ={casesType==="recovered"} click={(f)=>setCasesType("recovered")} title="Recovered" cases={formatprint(countryInfo.todayRecovered)} total={formatprint(countryInfo.recovered)}/>

            <InfoBox active ={casesType==="deaths"} click={(f)=>setCasesType("deaths")} title="Deaths" cases={formatprint(countryInfo.todayDeaths)} total={formatprint(countryInfo.deaths)}/>
      
            {/* <InfoBox click={(f)=>setCasesType("vaccines")} title="Vaccines" cases={formatprint(countryInfo.todayDeaths)} total={formatprint(countryInfo.deaths)}/> */}
      </div>

      <Map
        countries={mapCountries}
        casesType={casesType}
        center={mapCenter}
        zoom={mapZoom}  
      />

      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases</h3>
          <Table countries={tableData}/>
          <h3>{Country} {casesType} {formatprint(countryInfo[casesType])}</h3>
          <LineGraph casestypes={casesType} country={Country}/>
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
