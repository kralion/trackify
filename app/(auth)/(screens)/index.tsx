import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/clerk-expo';

type FormState = {
  orderDetails: string;
  destination: string;
  customerName: string;
};

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
    <View className=" flex flex-col gap-4 p-4">
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
      <Button className="mt-4" onPress={handleSubmit} accessibilityLabel="Enviar pedido">
        <Text>Registrar Pedido</Text>
      </Button>
      {/* // TODO: logout button */}
      <Button
        className="mt-4"
        onPress={() => signOut()}
        accessibilityLabel="Cerrar Sesión"
        variant={'destructive'}>
        <Text className="text-white">Cerrar Sesión</Text>
      </Button>
    </View>
  );
}
