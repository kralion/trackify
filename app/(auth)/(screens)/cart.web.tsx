import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store';
import { useOrder } from '@/store/order';
import { Product } from '@/types';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { MapPinHouse, Minus, Plus, Trash } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { toast } from 'sonner-native';

type Order = {
  destination: string;
  customer: string;
  distance: number;
  duration: number;
  origin: string;
  items: Product[];
  status: 'registrado' | 'enviado' | 'entregado';
};

export default function ShoppingCart() {
  const headerHeight = useHeaderHeight();
  const { addOrder } = useOrder();
  const { setItems } = useCartStore();
  const [form, setForm] = useState<Order>({
    destination: '',
    customer: '',
    distance: 0,
    duration: 0,
    origin: '',
    items: [],
    status: 'registrado',
  });

  //TODO: Handle the locations cause on the db it receives a geometry object type and here is a string, we need to convert it somehow
  const handleSubmit = () => {
    if (!form.items || !form.destination || !form.customer) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setForm({
      destination: '',
      customer: '',
      origin: '',
      duration: 0,
      distance: 0,
      items: [],
      status: 'registrado',
    });
    router.back();
  };
  const { items, removeItem } = useCartStore();

  const increaseQuantity = (item: Product) => {
    const itemIndex = items.findIndex((i) => i.id === item.id);
    if (itemIndex !== -1) {
      const newItems = [...items];
      newItems[itemIndex].quantity++;
      setItems(newItems);
    }
  };

  const decreaseQuantity = (itemId: number) => {
    const itemIndex = items.findIndex((i) => i.id === itemId);
    if (itemIndex !== -1) {
      const newItems = [...items];
      if (newItems[itemIndex].quantity > 1) {
        newItems[itemIndex].quantity--;
        setItems(newItems);
      }
    }
  };
  const subTotal = (cartItems: { price: number; quantity: number }[]) => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const taxes = (cartItems: { price: number; quantity: number }[]) => {
    return subTotal(cartItems) * 0.18;
  };

  const delivery = () => {
    return subTotal(items) > 50 ? 0 : 5;
  };

  const total = () => {
    return subTotal(items) + taxes(items) + delivery();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View className="   flex-row items-center  gap-4  md:gap-8">
      <Image
        source={{ uri: item.image_url }}
        className="rounded-xl"
        style={{ marginRight: 10, width: 100, height: 100 }}
      />
      <View className="  flex-1">
        <View className="flex flex-col gap-2">
          <Text className="text-lg font-bold" style={{ fontFamily: "Lato" }}>{item.name} </Text>
          <Text className="text-gray-500">S/. {item.price} PEN x porcion</Text>

          <View className="flex-row items-center">
            <Button
              size="icon"
              className="rounded-full"
              variant="secondary"
              onPress={() => {
                decreaseQuantity(item.id);
              }}>
              <Minus color="black" size={18} />
            </Button>
            <Text className="mx-2 text-lg">{item.quantity}</Text>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onPress={() => {
                increaseQuantity(item);
              }}>
              <Plus color="black" size={18} />
            </Button>
          </View>
        </View>
      </View>
      <Button
        size="icon"
        className="rounded-full"
        variant="destructive"
        onPress={() => {
          removeItem(item.id);
        }}>
        <Trash color="white" size={18} />
      </Button>
    </View>
  );
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="mx-auto  w-fit flex-col-reverse gap-16 p-4  lg:flex-row">
        <View className="mx-auto w-full flex-col  gap-8 md:w-[500px]">
          <Text className="mb-4 text-center text-2xl font-bold" style={{ fontFamily: "Bold" }}>Información del Pedido</Text>
          <View>
            <Label className="my-2 px-4 text-muted-foreground">Nombre del Cliente</Label>
            <Input
              className="rounded-full"
              placeholder="Jorge Ramirez Centeno"
              value={form.customer}
              onChangeText={(text) => setForm({ ...form, customer: text })}
            />
            <Label className="my-2 mt-4 px-4 text-muted-foreground">Ubicación</Label>
            <View className="flex flex-row items-center gap-3">
              <View className="flex-1">
                <Input
                  className="rounded-full"
                  placeholder="-123.456.789, -123.456.789"
                  value={
                    form.destination.length > 30
                      ? `${form.destination.slice(0, 30)}...`
                      : form.destination
                  }
                  onChangeText={(text) => setForm({ ...form, destination: text })}
                />
              </View>
              <Button
                size="icon"
                className="rounded-full"
                onPress={() => {
                  const [lat, lng] = form.destination.split(',');
                  Location.getCurrentPositionAsync().then((location) => {
                    const newLat = Number(lat) || location.coords.latitude;
                    const newLng = Number(lng) || location.coords.longitude;
                    setForm({ ...form, destination: `${newLat},${newLng}` });
                  });
                }}>
                <MapPinHouse color="black" size={18} />
              </Button>
            </View>
          </View>
          <View className="flex flex-col gap-3 rounded-lg border border-dashed border-zinc-400 p-4 ">
            <View className="flex flex-row justify-between">
              <Text className="mb-1 text-lg font-semibold" style={{ fontFamily: "Bold" }}>Sub total:</Text>
              <Text className="mb-1 text-lg text-muted-foreground" style={{ fontFamily: "Bold" }}>S/ {subTotal(items)}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="mb-1 text-lg font-semibold" style={{ fontFamily: "Bold" }}>IGV & Impuestos:</Text>
              <Text className="mb-1 text-lg text-muted-foreground" style={{ fontFamily: "Bold" }}>
                S/ {taxes(items).toFixed(2)}
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="mb-1 text-lg font-semibold" style={{ fontFamily: "Bold" }}>Delivery:</Text>
              <Text className="mb-1 text-lg text-muted-foreground" style={{ fontFamily: "Bold" }}>S/ {delivery().toFixed(2)}</Text>
            </View>
            <Separator decorative orientation="horizontal" />
            <View className="flex flex-row justify-between">
              <Text className="text-xl font-black" style={{ fontFamily: "Bold" }}>Total:</Text>
              <Text className="text-xl font-black" style={{ fontFamily: "Bold" }}>S/ {total().toFixed(2)}</Text>
            </View>
          </View>
          <Button size="lg" className=" rounded-full" onPress={handleSubmit}>
            <Text className="font-semibold" >Enviar pedido</Text>
          </Button>
        </View>

        <Animated.View entering={FadeInUp.duration(200).damping(10).delay(100)}>
          <FlatList
            data={items}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Separator className="my-4 md:my-8" />}
            contentContainerClassName=" md:w-[600px] rounded-xl bg-zinc-50 md:p-8 p-4"
            keyExtractor={(item) => String(item.id)}
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}
