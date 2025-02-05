import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BellDot, Dot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView className="flex flex-1 flex-col gap-8 bg-zinc-100 p-4">
      <View className="flex flex-col gap-4">
        <Text className=" text-center text-2xl font-bold">Seguimiento de Paquete</Text>
        <View className="mb-4 flex-row items-center rounded-full bg-white p-2">
          <TextInput placeholder="Código de Rastreo..." className="ml-4 flex-1" />
          <Button className="rounded-full">
            <Text>Ubicar</Text>
          </Button>
        </View>
      </View>
      <View className="flex flex-col gap-8 rounded-2xl bg-white p-4">
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
          <Button className="mt-4 rounded-full ">
            <Text>Ver Mapa</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TrackerScreen;
