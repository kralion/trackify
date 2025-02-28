import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BellDot, Dot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import { router } from 'expo-router';

type Status = {
  status: string;
  percentage: number;
  time: string;
  color: string;
};

const orderStats: Status[] = [
  { status: 'REGISTRADO', percentage: 12, time: '3hr 8min', color: '#dbeafe' },
  { status: 'EN CAMINO', percentage: 47, time: '5hr 42min', color: '#93c5fd' },
  { status: 'SUBIDO', percentage: 75, time: '2hr 4min', color: '#3b82f6' },
  { status: 'ESPERANDO', percentage: 100, time: '1hr 25min', color: '#1e40af' },
];
const TrackerScreen = () => {
  const [status, setStatus] = React.useState<Status>(orderStats[0]);
  const [orderFound, setOrderFound] = React.useState<boolean>(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => {
        const newColorIndex = orderStats.findIndex((stat) => stat.color === prev.color) + 1;
        return newColorIndex === orderStats.length ? orderStats[0] : orderStats[newColorIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView className="  bg-zinc-100 p-4" contentInsetAdjustmentBehavior="automatic">
      {!orderFound && (
        <Image
          source={require('@/assets/images/tracking.png')}
          style={{
            width: '100%',
            height: 250,
          }}
        />
      )}
      <View className=" flex-row items-center  bg-white p-2 rounded-xl">
        <Input
          placeholder="Código de Rastreo..."
          autoFocus
          className="relative  flex-1 border-0 rounded-xl"
        />
        <Button
          onPress={() => {
            setOrderFound(!orderFound);
          }}>
          <Text>Ubicar</Text>
        </Button>
      </View>

      {orderFound && (
        <View className="mt-10 flex flex-col gap-8 rounded-2xl bg-white p-4">
          <Text className="mb-2 text-lg font-semibold">Estadísticas de Seguimiento</Text>
          <Progress indicatorClassName="bg-blue-500" value={status.percentage} />
          <Text className="text-center">Items registrados : 13 paquetes</Text>
          <View className="flex flex-row flex-wrap justify-between">
            {orderStats.map((stat, index) => (
              <View
                key={index}
                className=" my-2 flex w-[48%] flex-col gap-4
             rounded-lg border border-gray-200 p-4">
                <View className="flex flex-row items-center gap-1">
                  <Dot strokeWidth={14} color={stat.color} size={14} />
                  <Text className="text-sm text-muted-foreground">{stat.status}</Text>
                </View>
                <View className="flex flex-row  items-baseline justify-between gap-2">
                  <Text className="text-xl font-bold">{stat.percentage}%</Text>
                  <Text className="text-sm">{stat.time}</Text>
                </View>
              </View>
            ))}
          </View>
          <View className="flex flex-col  ">
            <Text className="text-sm text-muted-foreground">RECEPTOR</Text>
            <Text className="font-bold">Jhon Ramirez Caballero</Text>
            <Button
              className="mt-4"
              onPress={() => {
                router.push('/(auth)/(screens)/map-tracking');
              }}>
              <Text>Ver Mapa</Text>
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default TrackerScreen;
