import React from 'react'
import {MapContainer as leafletMap, TileLayer} from "react-leaflet";
import "./Map.css";

function Map() {
  return (
    <div className="Map">
        <h1>Map</h1>
        <leafletMap>
          <TileLayer 
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </leafletMap>
    </div>
  );
}

export default Map