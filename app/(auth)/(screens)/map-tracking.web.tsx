import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import '../../../styles/map.css';
import { ActivityIndicator, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
      <div id="map-container" ref={mapContainerRef} />
      <div className="absolute bottom-4 left-1/2 flex h-[250px] w-[350px] -translate-x-1/2 flex-col gap-4 rounded-3xl bg-white p-4 shadow-xl md:h-[300px] md:w-[600px]">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xl font-bold text-gray-600">Preparando tu orden</div>
            <span>
              Llegara entre las <strong>10:15 AM - 10:30 AM</strong>
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <Badge className="rounded-full">
            <Car />
          </Badge>
          <Separator className="w-1/4 md:w-1/3" />
          <Badge className="rounded-full">
            <Car />
          </Badge>
          <Separator className="w-1/4 md:w-1/3" />
          <Badge className="rounded-full">
            <Car />
          </Badge>
        </div>

        <div className="mt-4">
          <div className="h-1 w-full rounded-full bg-gray-200">
            <div className="h-full w-1/3 rounded-full bg-[hsl(47.9,95.8%,53.1%)]"></div>
          </div>
        </div>
        <div className="mt-1  text-gray-500">Roberto es quien esta trayendo tu orden</div>

        <Button variant="link">
          <Text>Ver todos los detalles</Text>
        </Button>
      </div>
    </>
  );
}
