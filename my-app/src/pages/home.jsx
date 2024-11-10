import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const DynamicRouteMap = () => {
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [fetchReady, setFetchReady] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    const locations = [
        { name: 'Start', lat: 40.748817, lng: -73.985428 },  // Empire State Building
        { name: 'Destination', lat: 40.730610, lng: -73.935242 },  // Brooklyn
        // Add more locations here
    ];

    const containerStyle = {
        width: '100vw',
        height: '100vh',
    };

    const apiKey = 'AIzaSyD_P6xkyyx4MGnEU7tjaWULPsjZfecFQFY'; // Replace with your API Key
    
    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setUserLocation(currentLocation);
        });
    }, []);

    useEffect(() => {
        if (userLocation && window.google) {
            console.log('Fetching directions');
            console.log('User Location:', userLocation);
            const directionsService = new window.google.maps.DirectionsService();
            const waypoints = locations.slice(1, locations.length - 1).map(location => ({
                location: new window.google.maps.LatLng(location.lat, location.lng),
                stopover: true,
            }));

            directionsService.route(
                {
                    origin: userLocation,
                    destination: locations[locations.length - 1], // Last location
                    waypoints: waypoints,
                    travelMode: window.google.maps.TravelMode.DRIVING, // Or WALKING, BICYCLING, etc.
                },
                (result, status) => {
                    if (status === 'OK') {
                        setDirections(result);
                    } else {
                        setError('Unable to fetch directions: ' + status);
                    }
                }
            );
        }
        
        wait(3).then(() => setFetchReady(!fetchReady));
        
    }, [mapReady, fetchReady, locations]);

    return (
        <LoadScript 
        googleMapsApiKey={apiKey}
        onLoad={() => setMapReady(true)}
        >
            <GoogleMap mapContainerStyle={containerStyle} center={userLocation || locations[0]} >
                {directions && <DirectionsRenderer directions={directions} />}
                {error && <div>Error: {error}</div>}
            </GoogleMap>
        </LoadScript>
    );
};

export default DynamicRouteMap;
