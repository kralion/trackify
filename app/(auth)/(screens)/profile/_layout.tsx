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

          headerShown: false,
          title: "Perfil"

            }}
      />
      <Stack.Screen
        name="products"
        options={{
          headerShown: false,
          title: 'Productos',
          presentation: 'modal',
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


    </Stack>
  )
}