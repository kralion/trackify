import { View, Text, Platform, NativeSyntheticEvent, TextInputFocusEventData, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router';
import { Plus, PlusCircle, X } from 'lucide-react-native';
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
              <Text className='text-primary text-xl'>Atrás</Text>
            </TouchableOpacity>,
          headerRight: () => (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => router.push({ pathname: '/(auth)/(screens)/profile/products/add-product' })}
              accessibilityLabel="Agregar producto">
              <Text className='text-primary text-xl'>Agregar</Text>
            </TouchableOpacity>

          ),
        }}
      />



      <Stack.Screen
        name="add-product"
        options={({ route }) => {
          const { id } = route.params as { id: number };
          return {
            title: 'Agregar',
            headerBackTitle: "Cancelar",
            presentation: "card",
            headerBackground: () => Platform.OS !== 'ios' ? <View className="flex-1 bg-yellow-400" /> : undefined,
            headerTitleStyle:
              Platform.OS === 'web' && { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" },

            headerShadowVisible: false,
            headerRight: () => (
             Platform.OS !== 'ios' && <Button
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