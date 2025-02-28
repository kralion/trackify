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
          title: 'Productos',
          presentation: 'modal',
          headerTitleStyle:
            Platform.OS !== 'ios' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
          headerBackground: () => Platform.OS !== 'ios' ? <View className="flex-1 bg-yellow-400" /> : undefined,
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
          headerLeft: () => Platform.OS === 'ios' && <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onPress={() => router.back()}>
            <X color="#FFD500" />
          </Button>,
          headerRight: () => (
            <Button
              variant="ghost"
              size="icon"
              onPress={() => router.push({ pathname: '/(auth)/(screens)/profile/products/add-product' })}
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
            presentation: "card",
            headerBackground: () => Platform.OS !== 'ios' ? <View className="flex-1 bg-yellow-400" /> : undefined,
            headerTitleStyle:
              Platform.OS === 'web' && { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" },

            headerShadowVisible: false,
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