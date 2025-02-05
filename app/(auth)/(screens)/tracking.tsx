import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Image, Text, View } from 'react-native';

const TrackingScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <Image
          source={{
            uri: 'https://img.freepik.com/premium-vector/custom-location-map-interface-web-mobile-app_150101-8344.jpg?w=996',
          }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <View className="-mt-8 flex flex-col gap-8 rounded-t-3xl bg-gray-100 px-4 py-8 shadow">
        <View className="flex flex-col gap-2">
          <Text className="text-lg text-muted-foreground  ">DIRECCION DE ENTREGA</Text>
          <Text className="font-bold">
            Jr. Mariscal Castilla No. 123, San Juan de Miraflores, Lima, Peru
          </Text>
        </View>
        <View className="mb-4 flex flex-row justify-between rounded-xl bg-zinc-200 p-4">
          <View>
            <Text className="text-xs text-muted-foreground">DISTANCIA APROXIMADA</Text>
            <Text className="text-lg font-bold">214.8 km</Text>
          </View>
          <Separator decorative orientation="vertical" className="bg-zinc-300" />
          <View>
            <Text className="text-xs text-muted-foreground">TIEMPO ESTIMADO</Text>
            <Text className="text-lg font-bold">7.4 horas</Text>
          </View>
        </View>
        <View className="rounded-2xl border border-zinc-300 p-4">
          <View className="mb-4 flex flex-row items-center ">
            <Image
              source={{ uri: 'https://mighty.tools/mockmind-api/content/human/91.jpg' }}
              className="mr-4 h-12 w-12 rounded-full"
            />
            <View>
              <Text className="font-bold">Alberto Ramos Cornejo</Text>
              <Text className="text-gray-600">Telf: 975-111-382</Text>
            </View>
          </View>
          <View className="flex flex-row justify-between">
            <Button className="rounded-full bg-yellow-500 px-4 py-2 text-white">
              <Text>Llamar al Delivery</Text>
            </Button>
            <Button className="rounded-full bg-gray-200 px-4 py-2 text-black">
              <Text>Mensaje</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrackingScreen;
