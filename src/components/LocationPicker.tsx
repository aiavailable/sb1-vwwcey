import React from 'react';
import StateSelect from './location/StateSelect';
import CitySelect from './location/CitySelect';
import SuburbSelect from './location/SuburbSelect';
import { cityData } from '../data/suburbs';

interface Location {
  state: string;
  city: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationPickerProps {
  value: Location;
  onChange: (location: Location) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const handleStateChange = (newState: string) => {
    onChange({
      state: newState,
      city: '',
      neighborhood: '',
      coordinates: { lat: 0, lng: 0 }
    });
  };

  const handleCityChange = (newCity: string) => {
    onChange({
      ...value,
      city: newCity,
      neighborhood: '',
      coordinates: cityData[value.state]?.[newCity]?.coordinates || { lat: 0, lng: 0 }
    });
  };

  const handleSuburbChange = (newSuburb: string) => {
    onChange({
      ...value,
      neighborhood: newSuburb,
      coordinates: cityData[value.state]?.[value.city]?.coordinates || { lat: 0, lng: 0 }
    });
  };

  return (
    <div className="space-y-4">
      <StateSelect 
        value={value.state} 
        onChange={handleStateChange} 
      />
      
      <CitySelect 
        state={value.state}
        value={value.city} 
        onChange={handleCityChange} 
      />
      
      <SuburbSelect 
        state={value.state}
        city={value.city}
        value={value.neighborhood}
        onChange={handleSuburbChange}
      />
    </div>
  );
}