import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View, Image, TextInput } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/clerk-expo';
import { FlatList } from 'react-native';
import { Plus } from 'lucide-react-native';

type FormState = {
  orderDetails: string;
  destination: string;
  customerName: string;
};

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
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    name: 'Italian Spaghetti',
    category: 'Especialidades',
    price: 'S/20.25',
    image:
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    name: 'Tortas de Mil Hojas',
    category: 'Postres',
    price: 'S/15.50',
    image:
      'https://images.pexels.com/photos/243011/pexels-photo-243011.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    name: 'Caf  con Leche',
    category: 'Bebidas',
    price: 'S/4.25',
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
    rating: number;
    category: string;
  };
}) => (
  <View className="my-2 mr-6 flex w-48 flex-col gap-6 rounded-lg  bg-white p-2 shadow-sm">
    <Image source={{ uri: product.image }} className="mb-2 h-24 w-44 rounded" />
    <View className="flex flex-col gap-2">
      <Text className="text-center text-muted-foreground">{product.name}</Text>
      <Text className="text-center text-sm text-muted-foreground">{product.category}</Text>
    </View>
    <View className="flex flex-row items-center justify-between">
      <Text className="  p-2 text-xl font-bold">{product.price}</Text>
      <Button size="icon" className=" rounded-full">
        <Plus color="white" size={18} />
      </Button>
    </View>
  </View>
);

export default function OrderFormScreen() {
  const { signOut } = useAuth();
  const [form, setForm] = useState<FormState>({
    orderDetails: '',
    destination: '',
    customerName: '',
  });

  const handleSubmit = () => {
    if (!form.orderDetails || !form.destination || !form.customerName) {
      alert('Por favor complete todos los campos');
      return;
    }
    router.push({ pathname: '/status', params: form });
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="pb-24">
      <View className="flex flex-col gap-4 p-4">
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryCard category={item} active={item.id === '1'} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
        />
        <FlatList
          data={sampleProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
        <Input
          placeholder="Descripción del producto"
          value={form.orderDetails}
          onChangeText={(text) => setForm({ ...form, orderDetails: text })}
        />
        <Input
          placeholder="Dirección de entrega"
          value={form.destination}
          onChangeText={(text) => setForm({ ...form, destination: text })}
        />
        <Input
          placeholder="Destinatario"
          value={form.customerName}
          onChangeText={(text) => setForm({ ...form, customerName: text })}
        />
      </View>
      <View className="p-4">
        <Button className="mt-4" onPress={handleSubmit} accessibilityLabel="Enviar pedido">
          <Text>Registrar Pedido</Text>
        </Button>
        <Button
          className="mt-4"
          onPress={() => router.push({ pathname: '/(auth)/(screens)/tracker' })}
          accessibilityLabel="Enviar pedido">
          <Text>Form Tracking</Text>
        </Button>
        <Button
          className="mt-4"
          onPress={() => router.push({ pathname: '/(auth)/(screens)/tracking' })}
          accessibilityLabel="Enviar pedido">
          <Text>Map Tracking</Text>
        </Button>
        <Button
          className="mt-4"
          onPress={() => signOut()}
          accessibilityLabel="Cerrar Sesión"
          variant={'destructive'}>
          <Text className="text-white">Cerrar Sesión</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
