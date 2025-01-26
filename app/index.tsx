import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type FormState = {
  orderDetails: string;
  destination: string;
  customerName: string;
};

export default function OrderFormScreen() {
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
    <Card className="bg-background flex-1 p-4">
      <View className="space-y-4">
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
          placeholder="Nombre completo"
          value={form.customerName}
          onChangeText={(text) => setForm({ ...form, customerName: text })}
        />

        <Button className="mt-4" onPress={handleSubmit} accessibilityLabel="Enviar pedido">
          <Text>Registrar Pedido</Text>
        </Button>
      </View>
    </Card>
  );
}
