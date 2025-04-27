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
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import { Minus, Plus, Trash } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';


export default function ShoppingCart() {
  const { addOrder, loading } = useOrder();
  const { user } = useUser();
  const { items, removeItem } = useCartStore();
  const { isDarkColorScheme } = useColorScheme();
  const { setItems } = useCartStore();

  // Zod schema
  const cartFormSchema = z.object({
    customer: z.string().min(1, 'El nombre es obligatorio'),
    customizations: z.object({
      Salsas: z.array(z.string()).optional(),
      Papas: z.string().optional(),
      Marca: z.string().optional(),
      Notas: z.string().optional(),
    }).optional(),
    location: z.string().min(1, 'La ubicación es obligatoria'),
    paymentMethod: z.enum(['efectivo', 'yape']),
    paymentBill: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.paymentMethod === 'efectivo' && (!data.paymentBill || data.paymentBill.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este campo es obligatorio si paga en efectivo',
        path: ['paymentBill'],
      });
    }
  });

  type CartForm = z.infer<typeof cartFormSchema>;

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CartForm>({
    resolver: zodResolver(cartFormSchema),
    defaultValues: {
      customer: user?.fullName || '',
      location: (user?.unsafeMetadata.location as string) || '',
      paymentMethod: 'efectivo',
      paymentBill: '',
    },
  });

  const paymentMethod = watch('paymentMethod');

  function onLabelPress(label: string, onChange: (val: string) => void) {
    return () => {
      onChange(label);
    };
  }

  useEffect(() => {
    if (items.length <= 0) router.back();
  }, [items]);

  const handleReset = () => {
    setValue('location', '');
    setValue('customer', '');
    setValue('paymentMethod', 'efectivo');
    setValue('paymentBill', '');
    setItems([]);
    router.back();
  }

  const onSubmit = (data: CartForm) => {
    addOrder({
      ...data,
      items,
      customer: user?.fullName || data.customer,
      customizations: items.map((item) => item.customizations || { Salsas: [], Papas: '', Marca: '', Notas: '' }),
      user_id: user?.id,
      phone: user?.unsafeMetadata.phone as string || '',
      location: data.location,
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


  const total = () => {
    return subTotal(items) + 3;
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View className='flex flex-col '>
      <View className="   flex-row items-start  gap-4  md:gap-8">

        <Image
          source={{ uri: item.image_url }}
          className="rounded-xl"
          style={{ width: 100, height: 100 }}
        />
        <View className="  flex-1">
          <View className="flex flex-col gap-2">
            <View className='flex flex-col'>

              <Text className="md:text-lg font-bold" style={{ fontFamily: "Lato" }}>{item.name} </Text>
              <Text className="text-gray-500">S/. {item.price.toFixed(2)} x porcion</Text>
            </View>

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
        </Button> </View>
      {item.customizations && (
        <View className="mt-2 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {(item.customizations.Salsas?.length ?? 0) > 0 && (
            <Text className="text-xs text-muted-foreground">
              <Text className='text-xs' >Cremas:</Text> {(item.customizations.Salsas ?? []).join(', ')}
            </Text>
          )}
          {(item.customizations.Papas?.length ?? 0) > 0 && (
            <Text className="text-xs text-muted-foreground">
              <Text className='text-xs' >Papas:</Text> {(item.customizations.Papas)}
            </Text>
          )}
          {item.customizations.Marca && (
            <Text className="text-xs text-muted-foreground">
              <Text className='text-xs'>Marca:</Text> {item.customizations.Marca}
            </Text>
          )}
          {item.customizations.Notas && (
            <Text className="text-xs text-muted-foreground">
              <Text className='text-xs'>Notas:</Text> {item.customizations.Notas}
            </Text>
          )}
        </View>
      )}
    </View>
  );
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName='pb-16'>
      <View className="web:md:mx-auto  w-fit flex-col-reverse gap-16 p-4 md:pt-16 lg:flex-row">
        <View className="mx-auto w-full flex-col  md:gap-8 gap-4 md:w-[500px]">


          <Text className="md:mb-4 md:text-center text-2xl font-bold" style={{ fontFamily: "Bold" }}>Resumen </Text>
          <View>

            <Controller
              control={control}
              name="customer"
              render={({ field }) => (
                <Input
                  placeholder="Ingresa tu nombre"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            {errors.customer && (
              <Text className="text-red-500 px-2">{errors.customer.message}</Text>
            )}
            <Label className="my-2 mt-4 px-2 text-muted-foreground">Ubicación</Label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Input
                  placeholder="Av. Oswaldo N Regal 485 - Ref Fiscalía"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            {errors.location && (
              <Text className="text-red-500 px-2">{errors.location.message}</Text>
            )}
            <Label className="mt-4 mb-2 px-2 text-muted-foreground">Método de Pago</Label>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="gap-3"
                >
                  <RadioGroupItemWithLabel value='efectivo' onLabelPress={onLabelPress('efectivo', field.onChange)} />
                  <RadioGroupItemWithLabel value='yape' onLabelPress={onLabelPress('yape', field.onChange)} />
                </RadioGroup>
              )}
            />
            {paymentMethod === 'efectivo' && (
              <>
                <Label className="mt-4 mb-2 px-2 text-muted-foreground">
                  Con cuanto va a cancelar
                </Label>
                <Controller
                  control={control}
                  name="paymentBill"
                  render={({ field }) => (
                    <Input
                      placeholder="S/ 50.00"
                      value={field.value}
                      inputMode='numeric'
                      onChangeText={field.onChange}
                    />
                  )}
                />
                {errors.paymentBill && (
                  <Text className="text-red-500 px-2">{errors.paymentBill.message}</Text>
                )}
              </>
            )}
          </View>
          <LinearGradient
            colors={["#FF6347", "#FF4500"]}
            style={{ marginTop: 10, borderRadius: 10, width: "100%" }}
          >
            <TouchableOpacity
              className="flex-row flex items-center justify-between  animate-pulse p-4"
              onPress={() =>

                router.push("/(auth)/sign-up")
              }
            >
              <View className=" flex flex-col gap-2 w-4/5">
                <Text
                  className='text-white font-bold text-2xl'
                >
                  Créate una cuenta
                </Text>
                <Text className="opacity-80 " style={{ color: "white" }}>
                  Para que la próxima vez no tengas que estar rellenando el formulario
                </Text>
              </View>
              <View className="bg-white/20 rounded-full p-2 dark:bg-white/20 ">
                <FontAwesome5 name="key" size={28} color="white" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <View className="flex flex-col gap-3 rounded-lg border border-dashed border-zinc-400 p-4 dark:border-zinc-800 ">
            <View className="flex flex-row justify-between">
              <Text className="mb-1 text-lg font-semibold" style={{ fontFamily: "Bold" }}>Sub total:</Text>
              <Text className="mb-1 text-lg text-muted-foreground" style={{ fontFamily: "Bold" }}>S/ {subTotal(items)}</Text>
            </View>

            <View className="flex flex-row justify-between">
              <Text className="mb-1 text-lg font-semibold" style={{ fontFamily: "Bold" }}>Delivery:</Text>
              <Text className="mb-1 text-lg text-muted-foreground" style={{ fontFamily: "Bold" }}>S/ {3.00.toFixed(2)}</Text>
            </View>
            <Separator decorative orientation="horizontal" />
            <View className="flex flex-row justify-between">
              <Text className="text-xl font-black" style={{ fontFamily: "Bold" }}>Total:</Text>
              <Text className="text-xl font-black" style={{ fontFamily: "Bold" }}>S/ {total().toFixed(2)}</Text>
            </View>
          </View>
          <View className='flex flex-col gap-4'>
            <Button size="lg" onPress={handleSubmit(onSubmit)}>
              {loading ? <ActivityIndicator size='small' /> : <Text className="font-semibold" >Enviar pedido</Text>}
            </Button>
            <Button size="lg" variant="secondary" onPress={handleReset}>
              <Text className="font-semibold" style={{ color: 'red' }} >Cancelar Pedido</Text>
            </Button>
          </View>
        </View>
        <Animated.View entering={FadeInUp.duration(200).damping(10).delay(100)}>
          {items
            .slice()
            .reverse()
            .map((item) => (
              <React.Fragment key={String(item.cartItemId ?? item.id)}>
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