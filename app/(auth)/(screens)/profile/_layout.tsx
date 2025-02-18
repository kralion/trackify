import { View, Text, Platform, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router';
import { PlusCircle, X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Perfil',
          headerTitleStyle:
            Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
          headerLargeTitle: true,
          headerBackground: () => <View className="flex-1 bg-yellow-400" />,
          headerLargeTitleShadowVisible: false,
          headerBlurEffect: Platform.OS === 'ios' ? 'regular' : 'none',
          headerTransparent: Platform.OS === 'ios' ? true : false,
          headerShadowVisible: false,


        }}
      />
      <Stack.Screen
        name="products"
        options={{
          title: 'Productos',
          presentation: 'modal',
          headerTitleStyle:
            Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
          headerBackground: () => <View className="flex-1 bg-yellow-400" />,
          headerBlurEffect: Platform.OS === 'ios' ? 'regular' : 'none',
          headerTransparent: Platform.OS === 'ios' ? true : false,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: 'Buscar producto...',
            onSearchButtonPress: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
              const text = event.nativeEvent.text;
              router.setParams({
                query: text,
              });
            },
            onChangeText: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
              const text = event.nativeEvent.text;
              Platform.OS === 'web' &&
                router.setParams({
                  query: text,
                });
            },

            cancelButtonText: 'Cancelar',
            onCancelButtonPress: () => {
              router.setParams({
                query: '',
              });
            },
          },
          headerRight: () => (
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.push({ pathname: '/(auth)/(screens)/profile/add-product' })}
              accessibilityLabel="Enviar pedido">
              <PlusCircle />
            </Button>

          ),
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Mis Ordenes',
          presentation: 'modal',
          headerTitleStyle:
            Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
          headerBackground: () => <View className="flex-1 bg-yellow-400" />,
          headerBlurEffect: Platform.OS === 'ios' ? 'regular' : 'none',
          headerTransparent: Platform.OS === 'ios' ? true : false,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: 'Buscar producto...',
            onSearchButtonPress: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
              const text = event.nativeEvent.text;
              router.setParams({
                query: text,
              });
            },
            onChangeText: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
              const text = event.nativeEvent.text;
              Platform.OS === 'web' &&
                router.setParams({
                  query: text,
                });
            },

            cancelButtonText: 'Cancelar',
            onCancelButtonPress: () => {
              router.setParams({
                query: '',
              });
            },
          },
          headerRight: () => (
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.push({ pathname: '/(auth)/(screens)/profile/add-product' })}
              accessibilityLabel="Enviar pedido">
              <PlusCircle />
            </Button>

          ),
        }}
      />

      <Stack.Screen
        name="add-product"
        options={({ route }) => {
          const { id } = route.params as { id: number };
          return {
            title: 'Agregar Producto',
            headerBackground: () => <View className="flex-1 bg-yellow-400" />,
            headerTitleStyle:
              Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
            headerBlurEffect: Platform.OS === 'ios' ? 'regular' : 'none',
            headerTransparent: Platform.OS === 'ios' ? true : false,
            headerShadowVisible: Platform.OS === 'ios' ? true : false,
            headerRight: () => (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onPress={() => router.back()}>
                <X color="#FFD500" />
              </Button>
            ),
          };
        }}
      />


    </Stack>
  )
}