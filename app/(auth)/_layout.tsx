import ActiveRideSheet from '@/components/ActiveRideSheet';
import SelectedScooterSheet from '@/components/SelectedScooterSheet';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="(screens)/index"
        options={{ headerShown: true, headerLargeTitle: true, title: 'Formulario' }}
      />
      <Stack.Screen
        name="(screens)/status"
        options={({ route }) => {
          const { id } = route.params as { id: number };
          return {
            title: 'Detalles',
            presentation: 'modal',
            headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
            headerTransparent: Platform.OS === 'android' ? false : true,
            headerShadowVisible: false,
          };
        }}
      />
      <SelectedScooterSheet />
      <ActiveRideSheet />
    </Stack>
  );
}
