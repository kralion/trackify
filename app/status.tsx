import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';

type Params = {
  orderDetails: string;
  destination: string;
  customerName: string;
};

export default function ShippingStatusScreen() {
  const { orderDetails, destination, customerName } = useLocalSearchParams<Params>();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="flex flex-col gap-4 items-center p-4">
      <View className="my-4 flex w-full flex-col gap-2 rounded-xl  bg-zinc-100 p-4">
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
      <Image
        source={{
          uri: 'https://img.freepik.com/premium-vector/city-map-set-town-streets-with-green-line-park-river-downtown-gps-navigation-plans-abstract-transportation-urban-vector-drawing-town-small-road-maps-urban-patterns-texture_93083-1066.jpg?w=740',
        }}
        style={{
          width: 350,
          height: 500,
        }}
      />
    </ScrollView>
  );
}
