import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import '../../../styles/map.css';

export default function MapTrackingWeb() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWlndWVsMTU5NDU2NCIsImEiOiJjbTZmOWplcW4wMnphMmxxMXEydXl1cTMzIn0.AlpMqxqTRE39frsRRiW9ew';
    if (mapContainerRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.0242, 40.6941],
        zoom: 10.12,
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);
  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}
