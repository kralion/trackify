import { View, Text, Platform, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router';
import { PlusCircle, X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { TouchableOpacity } from 'react-native';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Perfil',
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
          headerLeft: () =>  <TouchableOpacity
              hitSlop={8}
              onPress={() => router.back()}
              accessibilityLabel="Atrás">
              <Text className='text-primary text-xl'>Cerrar</Text>
            </TouchableOpacity>,

        }}
      />


    </Stack>
  )
}