import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/lib/useColorScheme';
import { useCartStore } from '@/store';
import { useOrder } from '@/store/order';
import { Product } from '@/types';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Minus, Plus, Trash } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

type Order = {
  location: string;
  customer: string;
  phone: string;
  user_id?: string;
  paymentMethod: string;
  items: Product[];
};

export default function ShoppingCart() {
  const { addOrder, loading } = useOrder();
  const { user } = useUser();
  const { items, removeItem } = useCartStore();
  const { isDarkColorScheme } = useColorScheme();
  const { setItems } = useCartStore();
  const [form, setForm] = useState<Order>({
    location: user?.unsafeMetadata.location as string || '',
    customer: user?.fullName || '',
    user_id: user?.id || '',
    phone: user?.unsafeMetadata.phone as string || '',
    paymentMethod: 'efectivo',
    items: [],
  });

  function onLabelPress(label: string) {
    return () => {
      setForm({ ...form, paymentMethod: label });
    };
  }

  useEffect(() => {
    items.length <= 0 ? router.back() : null;
  }, [items]);

  const handleReset = () => {
    setForm({
      location: '',
      customer: '',
      phone: '',
      paymentMethod: 'efectivo',
      items: [],
    });
    setItems([]);
    router.back();
  }
  const handleSubmit = () => {
    if (!form.items || !form.location || !form.customer) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    addOrder({
      ...form,
      items,
      customer: user?.fullName || form.customer,
      user_id: user?.id,
      phone: user?.unsafeMetadata.phone as string || form.phone,
      location: form.location,
      totalPrice: total(),
    });
    handleReset();
    router.back();
  };


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
          <Text className="text-gray-500">S/. {item.price.toFixed(2)} x porcion</Text>

          <View className="flex-row items-center">
            <Button
              size="icon"
              className="rounded-full"
              variant="secondary"
              onPress={() => {
                decreaseQuantity(item.id);
              }}>
              <Minus color={isDarkColorScheme ? 'white' : 'black'} size={18} />
            </Button>
            <Text className="mx-2 text-lg">{item.quantity}</Text>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onPress={() => {
                increaseQuantity(item);
              }}>
              <Plus color={isDarkColorScheme ? 'white' : 'black'} size={18} />
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
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName='pb-16'>
      <View className="web:md:mx-auto  w-fit flex-col-reverse gap-16 p-4 md:pt-16 lg:flex-row">
        <View className="mx-auto w-full flex-col  md:gap-8 gap-4 md:w-[500px]">


          <Text className="md:mb-4 md:text-center text-2xl font-bold" style={{ fontFamily: "Bold" }}>Resumen </Text>
          <View>
            <Label className="my-2 px-2 text-muted-foreground">Nombre del Cliente</Label>
            <Input
              placeholder="Ingresa tu nombre"
              value={form.customer}
              onChangeText={(text) => setForm({ ...form, customer: text })}
            />
            <Label className="my-2 mt-4 px-2 text-muted-foreground">Ubicación</Label>
            {/* <View className="flex flex-row items-center gap-3">
              <View className="flex-1"> */}
            <Input
              placeholder="Av. Oswaldo N Regal 485"
              value={
                form.location.length > 30
                  ? `${form.location.slice(0, 30)}...`
                  : form.location
              }
              onChangeText={(text) => setForm({ ...form, location: text })}
            />

            <Label className="mt-4 mb-2 px-2 text-muted-foreground">Método de Pago</Label>
            <RadioGroup value={form.paymentMethod} onValueChange={(value) => setForm({ ...form, paymentMethod: value })} className='gap-3'>
              <RadioGroupItemWithLabel value='efectivo' onLabelPress={onLabelPress('efectivo')} />
              <RadioGroupItemWithLabel value='yape' onLabelPress={onLabelPress('yape')} />
            </RadioGroup>
          </View>

          <View className="flex flex-col gap-3 rounded-lg border border-dashed border-zinc-400 p-4 dark:border-zinc-800 ">
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
          <View className='flex flex-col gap-4'>
            <Button size="lg" onPress={handleSubmit}>
              {loading ? <ActivityIndicator size='small' /> : <Text className="font-semibold" >Enviar pedido</Text>}
            </Button>
            <Button size="lg" variant="secondary" onPress={handleReset}>
              <Text className="font-semibold" style={{ color: 'red' }} >Cancelar Pedido</Text>
            </Button>
          </View>
        </View>
        <Animated.View entering={FadeInUp.duration(200).damping(10).delay(100)}>
          {items.map((item) => (
            <React.Fragment key={String(item.id)}>
              {renderItem({ item })}
              <Separator className="my-4 md:my-8" />
            </React.Fragment>
          ))}
        </Animated.View>
      </View>
    </ScrollView>
  );
}


function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={'flex-row gap-2 items-center'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Label>
    </View>
  );
}