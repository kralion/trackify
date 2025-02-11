import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import '../../../styles/map.css';
import * as Location from 'expo-location';

export default function MapTrackingWeb() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setDeliveryLocation(location.coords);
  }
  useEffect(() => {
    getCurrentLocation();
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWlndWVsMTU5NDU2NCIsImEiOiJjbTZmOWplcW4wMnphMmxxMXEydXl1cTMzIn0.AlpMqxqTRE39frsRRiW9ew';
    if (mapContainerRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [deliveryLocation?.longitude ?? 0, deliveryLocation?.latitude ?? 0],
        zoom: 10.12,
      });
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);
  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <>
      {deliveryLocation && (
        <div id="map-container" ref={mapContainerRef} />
      )}
    </>
  );
}
