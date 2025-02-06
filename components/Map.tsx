import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useRef } from 'react';
import { View } from 'react-native';

MapboxGL.setAccessToken(
  'sk.eyJ1IjoibWlndWVsMTU5NDU2NCIsImEiOiJjbTZpM3o3dG8wNDl6MmpwcmlyenBnbDd3In0.tMvbSDsgL69lYp6BLBoAig'
);

type MapProps = {
  initialLocation: Location.LocationObjectCoords;
  deliveryLocation: Location.LocationObjectCoords;
  endLocation: Location.LocationObjectCoords;
};

export default function Map({ initialLocation, deliveryLocation, endLocation }: MapProps) {
  const mapRef = useRef<MapboxGL.MapView>(null);

  const routeCoordinates = endLocation
    ? [
        {
          latitude: initialLocation?.latitude,
          longitude: initialLocation?.longitude,
        },
        { latitude: deliveryLocation?.latitude, longitude: deliveryLocation?.longitude },
        { latitude: endLocation?.latitude, longitude: endLocation?.longitude },
      ]
    : deliveryLocation
      ? [
          {
            latitude: initialLocation?.latitude,
            longitude: initialLocation?.longitude,
          },
          {
            latitude: deliveryLocation?.latitude,
            longitude: deliveryLocation?.longitude,
          },
        ]
      : initialLocation
        ? [
            {
              latitude: initialLocation?.latitude,
              longitude: initialLocation?.longitude,
            },
          ]
        : [];

  return (
    <View className="flex-1 items-center justify-center">
      <View className="h-[700px] w-[400px]">
        <MapboxGL.MapView ref={mapRef} style={{ flex: 1 }}>
          <MapboxGL.Camera
            zoomLevel={16}
            centerCoordinate={[initialLocation?.longitude, initialLocation?.latitude]}
            animationDuration={0}
          />
          {initialLocation && (
            <MapboxGL.PointAnnotation
              id="initialLocation"
              coordinate={[initialLocation?.longitude, initialLocation?.latitude]}>
              <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </MapboxGL.PointAnnotation>
          )}
          {routeCoordinates.length > 1 && (
            <MapboxGL.ShapeSource
              id="routeSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoordinates.map((coord) => [coord.longitude, coord.latitude]),
                },
                properties: {
                  strokeColor: 'blue',
                },
              }}>
              <MapboxGL.LineLayer id="routeLine" style={{ lineColor: 'blue', lineWidth: 5 }} />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
      </View>
    </View>
  );
}
