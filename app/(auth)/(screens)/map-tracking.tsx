import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, PhoneCall } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import Map from '@/components/Map';
import { useOrder } from '@/store/order';
import { Order } from '@/types';
import { Label } from '@/components/ui/label';

export default function MapTrackingScreen() {
  const { id } = useLocalSearchParams();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const { getOrder } = useOrder();
  const [order, setOrder] = React.useState<Order>();
  const [deliveryLocation, setDeliveryLocation] =
    React.useState<Location.LocationObjectCoords | null>(null);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setDeliveryLocation(location.coords);
  }

  React.useEffect(() => {
    if (!id) return;
    getOrder(Number(id)).then((order) => {
      setOrder(order);
    });
    getCurrentLocation();
  }, []);


  return (
    <ScrollView>
      {/* {deliveryLocation && (
        <Map
          initialLocation={order?.origin as Location.LocationObjectCoords}
          deliveryLocation={deliveryLocation as Location.LocationObjectCoords}
          endLocation={order?.destination as Location.LocationObjectCoords}
        />
      )} */}

 <View style={{ position: "relative", width: "100%", height: 500 }}>

      <Image
        source={{
          uri: 'https://img.freepik.com/premium-vector/custom-location-map-interface-web-mobile-app_150101-8344.jpg?w=996',
        }}
        className="h-full w-full"
        />
        </View>
           <View
          className="p-4 flex-row mt-10 justify-between items-center absolute top-0 left-0 right-0 z-10"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
        </View>
      <View className="flex flex-col   p-4 ">
        <View className="flex flex-col gap-2">
          <Text className="text-lg text-muted-foreground  ">DIRECCION DE ENTREGA</Text>
          <Text className="font-bold">
            Jr. Mariscal Castilla No. 123, San Juan de Miraflores, Lima, Peru
          </Text>
        </View>
        <View className=" flex flex-row justify-between rounded-xl bg-zinc-100 my-4 p-4">
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

<Label className="m-2 ml-4  text-muted-foreground" >Delivery</Label>
       <View className='flex flex-row items-center justify-between bg-muted p-4 rounded-xl'>
          <View className=" flex flex-row items-center ">
            <Image
              source={{ uri: 'https://mighty.tools/mockmind-api/content/human/91.jpg' }}
              className="mr-4 h-12 w-12 rounded-full"
            />
            <View>
              <Text className="font-bold">Alberto Ramos Cornejo</Text>
              <Text className="text-gray-600">Telf: 975-111-382</Text>
            </View>
          </View>
          <Button className="rounded-full " size="icon">
            <PhoneCall size={18} color="black" />
          </Button>
        </View>
      </View>

    </ScrollView>
  );
}
