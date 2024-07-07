import { FormControl,Select,MenuItem, Card, CardContent  } from '@mui/material';
import React, { useState, useEffect } from 'react'
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const  [countries, setCountries]=useState([]);
  const  [Country, setCountry]=useState("ww");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData]=useState([]);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  }, [])
  
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
            <InfoBox title="Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>

            <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>

            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
      </div>

      <Map/>

      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases</h3>
          <Table countries={tableData}/>
          <h3>WW cases {countryInfo.cases}</h3>
          <LineGraph />
          {/* {abcd} */}
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
