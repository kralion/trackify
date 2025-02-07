import ActiveRideSheet from '@/components/ActiveRideSheet';
import SelectedScooterSheet from '@/components/SelectedScooterSheet';
import RideProvider from '@/providers/RideProvider';
import ScooterProvider from '@/providers/ScooterProvider';
import { router, Stack } from 'expo-router';
import {
  Button as NativeButton,
  NativeSyntheticEvent,
  Platform,
  TextInputFocusEventData,
  View,
} from 'react-native';
import ShoppingCartIcon from '../../components/ShoppingCartIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-expo';
import { Text } from '@/components/ui/text';
import { TouchableOpacity } from 'react-native';

export default function Layout() {
  const { user } = useUser();
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
                onSearchButtonPress: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  const text = event.nativeEvent.text;
                  router.setParams({
                    query: text,
                  });
                },
                cancelButtonText: 'Cancelar',
                onCancelButtonPress: () => {
                  router.setParams({
                    query: '',
                  });
                },
              },
              headerRight: () => (
                <View className="flex flex-row items-center gap-8">
                  <ShoppingCartIcon />
                  <TouchableOpacity
                    hitSlop={8}
                    onPress={() => router.push('/(auth)/(screens)/profile')}>
                    <Avatar alt="avatar">
                      <AvatarImage
                        source={{
                          uri: user?.imageUrl,
                        }}
                      />
                      <AvatarFallback>
                        <Text>{user?.fullName?.split(' ')[0]}</Text>
                      </AvatarFallback>
                    </Avatar>
                  </TouchableOpacity>
                </View>
              ),
            }}
          />

          <Stack.Screen
            name="(screens)/map-tracking"
            options={({ route }) => {
              const { id } = route.params as { id: number };
              return {
                title: 'Tracker',
                headerShown: false,
              };
            }}
          />
          <Stack.Screen
            name="(screens)/tracker"
            options={({ route }) => {
              const { id } = route.params as { id: number };
              return {
                title: 'Seguimiento',
                headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
                headerTransparent: Platform.OS === 'android' ? false : true,
                headerShadowVisible: false,
                headerRight: () => <NativeButton title="Cerrar" onPress={() => router.back()} />,
              };
            }}
          />
          <Stack.Screen
            name="(screens)/profile"
            options={({ route }) => {
              const { id } = route.params as { id: number };
              return {
                title: 'Perfil',
                headerBlurEffect: Platform.OS === 'android' ? 'none' : 'regular',
                headerTransparent: Platform.OS === 'android' ? false : true,
                headerShadowVisible: false,
                headerRight: () => (
                  <NativeButton title="Cerrar" color="#FFD500" onPress={() => router.back()} />
                ),
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
