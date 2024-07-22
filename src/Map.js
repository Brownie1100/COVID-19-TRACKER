import React, { useEffect } from 'react'
import {MapContainer, TileLayer, useMap} from "react-leaflet";
import "./Map.css";
import {dataonmap} from "./util.js";

function Map({countries,casesType, center, zoom}) {
  console.log(center+" center");
  return (
    <div className="Map">
        <h1>Map</h1>
        <MapContainer center={center} zoom={zoom}>
          <TileLayer 
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <ChangeView center={center} />
          {dataonmap(countries, casesType)}
        </MapContainer>
    </div>
  );
}
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}
export default Map