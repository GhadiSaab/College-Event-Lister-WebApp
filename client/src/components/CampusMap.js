import React, { useState } from 'react';
import croquis from './PlanCampus.jpg';  // Ensure this path is correct
import './CampusMap.css';

const CampusMap = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const buildings = [
    { id: 1, name: "Main Building", coords: "50,50,150,150", type: "academic" },
    { id: 2, name: "Library", coords: "200,50,300,150", type: "academic" },
    { id: 3, name: "Student Center", coords: "350,50,450,150", type: "administrative" },
    { id: 4, name: "Dormitory", coords: "50,200,150,300", type: "residential" },
    { id: 5, name: "Sports Complex", coords: "200,200,300,300", type: "administrative" },
    // Add more buildings as needed, matching the numbers in your croquis
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="campus-map-container">
      <div className="map-container">
        <div className="image-wrapper">
          <img src={croquis} alt="Campus Map" className="campus-map__image" />
        </div>
      </div>
      <div className="info-container">
        <h1>Campus Map</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a building..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="building-info">
          {filteredBuildings.length > 0 ? (
            filteredBuildings.map(building => (
              <div key={building.id} className="building-item">
                <h2>{building.name}</h2>
                <p>Building Number: {building.id}</p>
                <p>Type: {building.type}</p>
              </div>
            ))
          ) : (
            <p>No buildings found</p>
          )}
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="color-box academic"></div>
            <span>Academic</span>
          </div>
          <div className="legend-item">
            <div className="color-box residential"></div>
            <span>Residential</span>
          </div>
          <div className="legend-item">
            <div className="color-box administrative"></div>
            <span>Administrative</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
