import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Params = {
  orderDetails: string;
  destination: string;
  customerName: string;
};

export default function ShippingStatusScreen() {
  const [status, setStatus] = useState<'En camino' | 'Entregado'>('En camino');
  const { orderDetails, destination, customerName } = useLocalSearchParams<Params>();

  return (
    <Card className="bg-background flex-1 p-4">
      <View className="space-y-6">
        <View className="items-center">
          <Badge variant={status === 'En camino' ? 'secondary' : 'outline'}>
            <Text>{status}</Text>
          </Badge>
        </View>

        <View className="space-y-2">
          <Text className="text-lg font-semibold">Detalles del pedido:</Text>
          <Text>{orderDetails}</Text>
        </View>

        <View className="space-y-2">
          <Text className="text-lg font-semibold">Destino:</Text>
          <Text>{destination}</Text>
        </View>

        <View className="space-y-2">
          <Text className="text-lg font-semibold">Cliente:</Text>
          <Text>{customerName}</Text>
        </View>

        <View className="mt-8 flex-row justify-between">
          <Button
            variant="secondary"
            onPress={() => setStatus('En camino')}
            disabled={status === 'En camino'}>
            <Text>Marcar como En Camino</Text>
          </Button>

          <Button onPress={() => setStatus('Entregado')} disabled={status === 'Entregado'}>
            <Text>Marcar como Entregado</Text>
          </Button>
        </View>
      </View>
    </Card>
  );
}
