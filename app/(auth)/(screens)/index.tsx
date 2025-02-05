import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View, Image, TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/clerk-expo';
import { FlatList } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useCartStore } from '@/store';

const categories = [
  { id: '1', name: 'Todos', icon: '🍽️' },
  { id: '2', name: 'Especialidades', icon: '🍝' },
  { id: '3', name: 'Postres', icon: '🍰' },
  { id: '4', name: 'Bebidas', icon: '🍹' },
];

const sampleProducts = [
  {
    id: '1',
    name: 'Briyani Rice',
    category: 'Especialidades',
    price: 'S/20.25',
    quantity: 10,
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    name: 'Italian Spaghetti',
    category: 'Especialidades',
    price: 'S/20.25',
    quantity: 10,
    image:
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    name: 'Tortas de Mil Hojas',
    category: 'Postres',
    price: 'S/15.50',
    quantity: 10,
    image:
      'https://images.pexels.com/photos/243011/pexels-photo-243011.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    name: 'Caf  con Leche',
    category: 'Bebidas',
    price: 'S/4.25',
    quantity: 10,
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const CategoryCard = ({
  category,
  active,
}: {
  category: { id: string; name: string; icon: string };
  active: boolean;
}) => (
  <View className="mr-8 items-center">
    <Text className="text-5xl">{category.icon}</Text>
    <Text className={`text-sm  ${active ? 'text-black' : 'text-muted-foreground'}`}>
      {category.name}
    </Text>
  </View>
);

const ProductCard = ({
  product,
}: {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
    quantity: number;
  };
}) => {
  const { addItem } = useCartStore();
  return (
    <View className="my-2 mr-6 flex w-48 flex-col gap-4 rounded-lg  bg-white shadow-sm">
      <Image source={{ uri: product.image }} className="h-36 w-full rounded-t-lg" />
      <View className="flex flex-col gap-2">
        <Text className="text-center text-muted-foreground">{product.name}</Text>
        <Text className="text-center text-sm text-muted-foreground">{product.category}</Text>
      </View>
      <View className="flex flex-row items-center justify-between p-2">
        <Text className="  p-2 text-xl font-bold">{product.price}</Text>
        <Button
          size="icon"
          className=" rounded-full"
          onPress={() => addItem({ ...product, quantity: 1 })}>
          <Plus color="white" size={18} />
        </Button>
      </View>
    </View>
  );
};

export default function OrderFormScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="pb-24">
      <View className="flex flex-col gap-4 py-4">
        <Text className="px-4  uppercase text-muted-foreground">Categorías</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryCard category={item} active={item.id === '1'} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
        />
        <Text className="px-4  uppercase text-muted-foreground">Más Pedidos</Text>
        <FlatList
          data={sampleProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
        />
        <Text className="px-4  uppercase text-muted-foreground">Agregados Recientes</Text>
        <FlatList
          data={sampleProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
        />
        <Text className="px-4  uppercase text-muted-foreground">Clásicos</Text>
        <FlatList
          data={sampleProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
        />
      </View>
    </ScrollView>
  );
}
