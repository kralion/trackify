import ActiveRideSheet from '@/components/ActiveRideSheet';
import { ThemeToggle } from '@/components/ThemeToogle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import RideProvider from '@/providers/RideProvider';
import { useUser } from '@clerk/clerk-expo';
import { router, Stack } from 'expo-router';
import { debounce } from 'lodash';
import { User } from 'lucide-react-native';
import { useState } from 'react';
import { NativeSyntheticEvent, Platform, TextInputFocusEventData, TouchableOpacity, View } from 'react-native';
import ShoppingCartIcon from '../../components/ShoppingCartIcon';

export default function Layout() {
  const { user } = useUser();
  const [search, setSearch] = useState('');


  const handleSearchDebounce = debounce((text: string) => {
    router.setParams({
      query: text,
    });
  }, 500);
  return (
    <RideProvider>
      <Stack>
        <Stack.Screen
          name="(screens)/index"
          options={{
            title: 'Tito\'s Menú',
            headerTitleStyle:
              Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
            headerLargeTitle: true,
            headerSearchBarOptions: {
              placeholder: 'Buscar producto...',
              onSearchButtonPress: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                const text = event.nativeEvent.text;
                setSearch(text);
                handleSearchDebounce(text);
              },
              onChangeText: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                const text = event.nativeEvent.text;
                setSearch(text);
                handleSearchDebounce(text);
              },
              cancelButtonText: 'Cancelar',
              onCancelButtonPress: () => {
                router.setParams({
                  query: '',
                });
                setSearch('');
              },
            },
            headerRight: () => (
              <View className="flex flex-row items-center gap-4">
                <ShoppingCartIcon />
                {
                  user ?

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
                    </TouchableOpacity> : <TouchableOpacity
                      hitSlop={8}
                      onPress={() => router.push('/(public)/sign-in')}>
                      <User />
                    </TouchableOpacity>

                }

                {/* <View className="hidden flex-row items-center gap-2 md:flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() => router.push({ pathname: '/(auth)/(screens)/tracker' })}
                      accessibilityLabel="Enviar pedido">
                      <Info />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() => router.push({ pathname: '/(auth)/(screens)/map-tracking' })}
                      accessibilityLabel="Enviar pedido">
                      <MapPinCheck />
                    </Button>
                  </View> */}
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="(screens)/cart"
          options={{
            title: 'Pedido',
            presentation: 'modal',
            headerTitleStyle:
              Platform.OS === 'web' && { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" },


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
              headerBackground: () => Platform.OS !== 'ios' ? <View className="flex-1 bg-orange-400" /> : undefined,
              headerTitleStyle:
                Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
              headerShadowVisible: false,

            };
          }}
        />
        <Stack.Screen
          name="(screens)/profile"
          options={{
            title: 'Perfil',
            headerTitleStyle:
              Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
            headerShadowVisible: false,
            headerShown: true,
            headerRight: () => (
              <ThemeToggle />
            ),

          }}
        />
      </Stack>

      <ActiveRideSheet />
    </RideProvider>
  );
}
