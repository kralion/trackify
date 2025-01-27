import { Camera, LocationPuck, MapView, MarkerView, PointAnnotation } from '@rnmapbox/maps';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Badge } from '@/components/ui/badge';

type Params = {
  orderDetails: string;
  destination: string;
  customerName: string;
};

const styles = StyleSheet.create({
  touchableContainer: { borderColor: 'black', borderWidth: 1.0, width: 60 },
  touchable: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
  matchParent: { flex: 1 },
});

const INITIAL_COORDINATES: [number, number][] = [
  [-73.99155, 40.73581],
  [-73.99155, 40.73681],
];
const AnnotationContent = ({ title }: { title: string }) => (
  <View style={styles.touchableContainer}>
    <Text>{title}</Text>
    <TouchableOpacity style={styles.touchable}>
      <Text style={styles.touchableText}>Btn</Text>
    </TouchableOpacity>
  </View>
);
export default function ShippingStatusScreen() {
  const { orderDetails, destination, customerName } = useLocalSearchParams<Params>();
  const [pointList, setPointList] = React.useState<GeoJSON.Position[]>(INITIAL_COORDINATES);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [allowOverlapWithPuck, setAllowOverlapWithPuck] = React.useState<boolean>(false);

  const onPressMap = (e: GeoJSON.Feature) => {
    const geometry = e.geometry as GeoJSON.Point;
    setPointList((pl) => [...pl, geometry.coordinates]);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="flex flex-col gap-4 items-center p-4">
      <View className="my-4 flex w-full flex-col gap-2 rounded-xl bg-zinc-100 p-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-lg font-semibold">Status:</Text>
          <Badge>
            <Text>En camino</Text>
          </Badge>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-lg font-semibold">Detalles del pedido:</Text>
          <Text>{orderDetails}</Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Text className="text-lg font-semibold">Destino:</Text>
          <Text>{destination}</Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Text className="text-lg font-semibold">Cliente:</Text>
          <Text>{customerName}</Text>
        </View>
      </View>

      {errorMsg ? (
        <Text className="text-red-500">{errorMsg}</Text>
      ) : location ? (
        <View className="overflow-hidden rounded-xl" style={{ width: 350, height: 500 }}>
          <MapView
            style={{ flex: 1 }}
            logoEnabled={false}
            attributionEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
            rotateEnabled={false}
            pitchEnabled={false}>
            <Camera
              defaultSettings={{
                zoomLevel: 16,
                centerCoordinate: pointList[0],
              }}
            />
            <MarkerView coordinate={pointList[0]} allowOverlapWithPuck={allowOverlapWithPuck}>
              <AnnotationContent title={'Punto de locacion'} />
            </MarkerView>
            {pointList.slice(2).map((coordinate, index) => (
              <PointAnnotation
                coordinate={coordinate}
                id={`pt-ann-${index}`}
                key={`pt-ann-${index}`}>
                <AnnotationContent title={'Punto de locacion'} />
              </PointAnnotation>
            ))}
            <LocationPuck />
          </MapView>
        </View>
      ) : (
        <View
          style={{ width: 350, height: 500 }}
          className="items-center justify-center bg-zinc-100">
          <Text>Cargando mapa...</Text>
        </View>
      )}
    </ScrollView>
  );
}
