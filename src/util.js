import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";

const casesTypeColors = {
    cases: {
      option: { color:"#cc1034", fillColor: "#cc1034" },
      multiplier: 200,
    },
    recovered: {
      option: { color:"#7dd71d", fillColor: "#7dd71d" },
      multiplier: 300,
    },
    deaths: {
      option: { color:"#ff6c47", fillColor: "#ff6c47" },
      multiplier: 500,
    },
};

export const sortData=(data)=>{
    const sortedData=[...data];
    return sortedData.sort((a,b)=>
        a.cases>b.cases?-1:1
    );
    // return sortedData;
};

export const dataonmap=(data, casesType)=>
    data.map((country)=>
    (
        <Circle
            center={[country.countryInfo.lat,country.countryInfo.long]}
            // color={casesTypeColors[casesType].hex}
            // fillColor={casesTypeColors[casesType].hex}
            pathOptions={casesTypeColors[casesType].option}
            fillOpacity={0.4}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
              }
        >
            <Popup>
              <div className="popup">
                <div  className="popupflag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}/>
                <div  className="popupcountry">{country.country}</div>
                <div  className="popupcases">Cases: {formatprint(country.cases)}</div>
                <div  className="popupdeaths">Deaths: {formatprint(country.deaths)}</div>
                <div  className="popuprecovered">Recovered: {formatprint(country.recovered)}</div>
              </div>

            </Popup>
        </Circle>
    )
);
export const formatprint=(stat)=>
  stat ? `${indianNumbers(stat)}`: "0";

function indianNumbers(n){
  const a=n.toString().substring(n.toString().length-3);
  const b=n.toString().substring(0,n.toString().length-3);
  const formattedNumber = b==""?a:b.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ',' + a;
  return formattedNumber;
}