import ActiveRideSheet from '@/components/ActiveRideSheet';
import SelectedScooterSheet from '@/components/SelectedScooterSheet';
import RideProvider from '@/providers/RideProvider';
import ScooterProvider from '@/providers/ScooterProvider';
import { router, Stack } from 'expo-router';
import { Button as NativeButton, Platform, View, StyleSheet } from 'react-native';
import ShoppingCartIcon from '../../components/ShoppingCartIcon';

export default function Layout() {
  return (
    <ScooterProvider>
      <RideProvider>
        <Stack>
          <Stack.Screen
            name="(screens)/index"
            options={{
              title: 'Productos',
              presentation: 'modal',
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
              headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
              headerTransparent: Platform.OS === 'android' ? false : true,
              headerShadowVisible: false,
              headerSearchBarOptions: {
                placeholder: 'Buscar producto...',
                hideWhenScrolling: true,
              },
              headerRight: () => (
                <View>
                  <ShoppingCartIcon />
                </View>
              ),
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
          <Stack.Screen
            name="(screens)/tracking"
            options={({ route }) => {
              const { id } = route.params as { id: number };
              return {
                title: 'Tracker',
                headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
                headerTransparent: Platform.OS === 'android' ? false : true,
                headerShadowVisible: false,
                headerRight: () => <NativeButton title="Cerrar" onPress={() => router.back()} />,
              };
            }}
          />
          <Stack.Screen
            name="(screens)/tracker"
            options={({ route }) => {
              const { id } = route.params as { id: number };
              return {
                title: 'Tracker',
                headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
                headerTransparent: Platform.OS === 'android' ? false : true,
                headerShadowVisible: false,
                headerRight: () => <NativeButton title="Cerrar" onPress={() => router.back()} />,
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
