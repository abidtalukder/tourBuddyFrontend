import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const DynamicRouteMap = () => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [fetchReady, setFetchReady] = useState(false);
  const [stops, setStops] = useState([]);
  let [count, setCount] = useState(0);

  const places = [
    "Empire State Building",
    "Brooklyn",
    "Harvard University",
    "Golden Gate Bridge",
    "Grand Canyon",
  ];

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const apiKey = "AIzaSyD_P6xkyyx4MGnEU7tjaWULPsjZfecFQFY"; // Replace with your API Key

  async function geocodeAddress(address) {
    if (!window.google.maps.Geocoder) {
        reject("Geocoder not available");
    }
    let geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          const latLng = results[0].geometry.location;
          resolve({ lat: latLng.lat(), lng: latLng.lng() });
        } else {
          reject("Geocode was not successful: " + status);
        }
      });
    });
  }


  async function setLocations(lst) {
    console.log("Setting locations");
    let locations = [];
    
    for (let i = 0; i < lst.length; i++) {
      try {
        const location = await geocodeAddress(lst[i]);
        if (typeof location === "object" && location.lat && location.lng) {
            locations.push(location);
        }
      } catch (error) {
        console.error(error);
      }
    }
    
    setStops(locations); // Update stops once all geocoding is complete
  }

  // useEffects
  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(currentLocation);
    });
    
    setLocations(places);
  }, []);

  useEffect(() => {
    if (userLocation && window.google.maps) {
      console.log("Fetching directions");
      console.log("User Location:", userLocation);
      const directionsService = new window.google.maps.DirectionsService();
      let waypoints = [];
      if (stops.length >= 2) {
        waypoints = stops
          .slice(0, stops.length-1)
          .map((i) => ({
            location: i,
            stopover: true,
          }));
      }

      let destination = userLocation;
      if (stops.length >= 1) {
        destination = stops[stops.length - 1];
      }
      
      console.log("waypoints:", waypoints);

      directionsService.route(
        {
          origin: userLocation,
          destination: destination, // Last location
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.WALKING, // Or WALKING, BICYCLING, etc.
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            setError("Unable to fetch directions: " + status);
          }
        }
      );
    }
    
    console.log("Stops:", stops);

    wait(5).then(() => setFetchReady(!fetchReady));
    
  }, [fetchReady, stops]);

  const handleMapLoad = (map) => {
    map.setZoom(50); // Set the zoom level to 20
  };
  
  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={50}
        onLoad={handleMapLoad}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {error && <div>Error: {error}</div>}
      </GoogleMap>
  );
};

export default DynamicRouteMap;
