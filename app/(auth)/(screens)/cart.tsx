import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store';
import { useOrder } from '@/store/orders';
import { CartItem, Order } from '@/types';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import { MapPinHouse, Minus, Plus, Trash } from 'lucide-react-native';
import { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Button as NativeButton,
  Platform,
  Text,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

export default function ShoppingCart() {
  const headerHeight = useHeaderHeight();
  const { addOrder } = useOrder();
  const [form, setForm] = useState<Order>({
    destination: '',
    customer: '',
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
    addOrder({
      ...form,
      origin: form.destination,
    });
    setForm({
      destination: '',
      customer: '',
      origin: '',
      items: [],
      status: 'registrado',
    });
    router.back();
  };
  const { items, removeItem } = useCartStore();

  const increaseQuantity = (item: CartItem) => {
    const itemIndex = items.findIndex((i) => i.id === item.id);
    if (itemIndex !== -1) {
      items[itemIndex].quantity++;
    }
  };

  const decreaseQuantity = (itemId: string) => {
    const itemIndex = items.findIndex((i) => i.id === itemId);
    if (itemIndex !== -1) {
      items[itemIndex].quantity--;
    }
  };
  const subTotal = (cartItems: { price: string; quantity: number }[]) => {
    return cartItems.reduce((total, item) => {
      const priceNumber = parseFloat(item.price.replace('S/', '')); // Convert price to a number
      return total + priceNumber * item.quantity;
    }, 0);
  };

  const taxes = (cartItems: { price: string; quantity: number }[]) => {
    return subTotal(cartItems) * 0.18;
  };

  const delivery = () => {
    return subTotal(items) > 50 ? 0 : 5;
  };

  const total = () => {
    return subTotal(items) + taxes(items) + delivery();
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="  mt-8 flex-row items-center">
      <Image
        source={{ uri: item.image }}
        className="rounded-xl"
        style={{ marginRight: 10, width: 100, height: 100 }}
      />
      <View className="ml-4 flex-1">
        <View className="flex flex-col gap-2">
          <Text className="text-lg font-bold">{item.name}</Text>
          <Text className="text-gray-500">{item.price}</Text>

          <View className="flex-row items-center">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onPress={() => {
                decreaseQuantity(item.id);
              }}>
              <Minus color="black" size={18} />
            </Button>
            <Text className="mx-2 text-lg">{item.quantity}</Text>
            <Button
              size="icon"
              className="rounded-full"
              variant="secondary"
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
    <View className="flex-1" style={{ marginTop: headerHeight }}>
      <Stack.Screen
        name="(screens)/cart"
        options={{
          title: 'Carrito',
          presentation: 'modal',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
          headerTransparent: Platform.OS === 'android' ? false : true,
          headerShadowVisible: false,
          headerRight: () => <NativeButton title="Cerrar" onPress={() => router.back()} />,
        }}
      />
      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            renderItem={renderItem}
            contentContainerClassName="px-4"
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <View>
                <Label className="my-2 px-4 text-muted-foreground">Cliente</Label>
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
                      if (!lat || !lng) {
                        toast.error('Please enter a valid latitude and longitude.');
                        return;
                      }
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
            }
            ListFooterComponent={
              <View className="flex flex-col gap-3 rounded-lg py-8">
                <View className="flex flex-row justify-between">
                  <Text className="mb-1 text-lg font-semibold">Sub total:</Text>
                  <Text className="mb-1 text-lg text-muted-foreground">S/ {subTotal(items)}</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="mb-1 text-lg font-semibold">IGV & Impuestos:</Text>
                  <Text className="mb-1 text-lg text-muted-foreground">
                    S/ {taxes(items).toFixed(2)}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="mb-1 text-lg font-semibold">Delivery:</Text>
                  <Text className="mb-1 text-lg text-muted-foreground">
                    S/ {delivery().toFixed(2)}
                  </Text>
                </View>
                <Separator decorative orientation="horizontal" />
                <View className="flex flex-row justify-between">
                  <Text className="text-xl font-black">Total:</Text>
                  <Text className="text-xl font-black">S/ {total().toFixed(2)}</Text>
                </View>
                <Button size="lg" className="mt-4 rounded-full" onPress={handleSubmit}>
                  <Text className="font-semibold">Enviar pedido</Text>
                </Button>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
