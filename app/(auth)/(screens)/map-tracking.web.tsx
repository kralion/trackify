import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import '../../../styles/map.css';
import { ActivityIndicator, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapTrackingWeb() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<GeolocationPosition | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeliveryLocation(position);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg('Permission to access location was denied.');
            Alert.alert(
              'Location Permission Denied',
              'Please enable location services in your browser settings.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setErrorMsg('The request to get user location timed out.');
            break;

          default:
            setErrorMsg('An unknown error occurred.');
        }
      }
    );
  };
  useEffect(() => {
    setLoading(true);
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWlndWVsMTU5NDU2NCIsImEiOiJjbTZmOWplcW4wMnphMmxxMXEydXl1cTMzIn0.AlpMqxqTRE39frsRRiW9ew';
    if (mapContainerRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.937165, -12.251828],
        zoom: 14,
      });
    }

    setLoading(false);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  if (loading)
    return (
      <SafeAreaView className=" items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <>
      <Text>Map y Tu ubicacion</Text>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}
