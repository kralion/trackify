import ActiveRideSheet from '@/components/ActiveRideSheet';
import SelectedScooterSheet from '@/components/SelectedScooterSheet';
import RideProvider from '@/providers/RideProvider';
import ScooterProvider from '@/providers/ScooterProvider';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <ScooterProvider>
      <RideProvider>
        <Stack>
          <Stack.Screen
            name="(screens)/index"
            options={{
              title: 'Formulario', presentation: 'modal',
              headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
              headerTransparent: Platform.OS === 'android' ? false : true,
              headerShadowVisible: false,
            }}
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
        </Stack>
        <SelectedScooterSheet />
        <ActiveRideSheet />
      </RideProvider>
    </ScooterProvider>
  );
}
