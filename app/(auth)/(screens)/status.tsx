import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { supabase } from '@/utils/supabase';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

MapboxGL.setAccessToken(
  'sk.eyJ1IjoibWlndWVsMTU5NDU2NCIsImEiOiJjbTZpM3o3dG8wNDl6MmpwcmlyenBnbDd3In0.tMvbSDsgL69lYp6BLBoAig'
);

export default function MapScreen() {
  const form = useLocalSearchParams();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([-12.0579340, -77.1192740]);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  const handleSendLocation = async () => {
    if (!location) return;
    const { error } = await supabase.from('orders').insert({
      name: form.customerName,
      initial_location: [location.coords.longitude, location.coords.latitude],
      final_location: destinationCoords,
      location: [location.coords.longitude, location.coords.latitude],
      description: form.orderDetails,
    });
    if (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <View className="flex flex-col items-center justify-center p-5">
        <Button onPress={handleSendLocation}>
          <Text>Enviar mi ubicación</Text>
        </Button>
        <Text>
          {location?.coords.latitude}, {location?.coords.longitude}
        </Text>
      </View>
      {location && (
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera
            zoomLevel={12}
            centerCoordinate={[-12.05793, -77.11927]}
          />
          
          {/* Marcador de inicio (ubicación actual) */}
          <MapboxGL.PointAnnotation
            id="startPoint"
            coordinate={[-12.05793, -77.11927]}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, { backgroundColor: '#007AFF' }]} />
            </View>
          </MapboxGL.PointAnnotation>

          {/* Marcador de destino */}
          <MapboxGL.PointAnnotation
            id="endPoint"
            coordinate={destinationCoords}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, { backgroundColor: '#FF3B30' }]} />
            </View>
          </MapboxGL.PointAnnotation>

          {/* Línea de ruta */}
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [location.coords.longitude, location.coords.latitude],
                  destinationCoords
                ],
              },
            }}
          >
            <MapboxGL.LineLayer
              id="routeLine"
              style={{
                lineColor: '#007AFF',
                lineWidth: 3,
              }}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
  markerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
});
