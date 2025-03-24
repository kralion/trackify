import ActiveRideSheet from '@/components/ActiveRideSheet';
import RideProvider from '@/providers/RideProvider';
import { router, Stack } from 'expo-router';
import { NativeSyntheticEvent, Platform, TextInputFocusEventData, View } from 'react-native';
import ShoppingCartIcon from '../../components/ShoppingCartIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-expo';
import { Text } from '@/components/ui/text';
import { TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/button';
import { Info, MapPinCheck, X } from 'lucide-react-native';

export default function Layout() {
  const { user } = useUser();
  return (
      <RideProvider>
        <Stack>
          <Stack.Screen
            name="(screens)/index"
            options={{
              title: 'Mi Tienda' ,

              headerTitleStyle:
                Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
              headerLargeTitle: true,
              headerBackground: () => Platform.OS !== 'ios' ? <View className="flex-1 bg-yellow-400" /> : undefined,
              headerLargeTitleShadowVisible: false,

              headerShadowVisible: false,
              headerSearchBarOptions: {
                placeholder: 'Buscar producto...',
                onSearchButtonPress: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  const text = event.nativeEvent.text;
                  router.setParams({
                    query: text,
                  });
                },
                onChangeText: (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  const text = event.nativeEvent.text;
                  Platform.OS === 'web' &&
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

                  <View className="hidden flex-row items-center gap-2 md:flex">
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
                  </View>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="(screens)/cart"
            options={{
              title: 'Carrito',
              presentation: 'modal',
              headerTitleStyle:
                Platform.OS === 'web' && { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } ,
              headerBackground: () => <View className="flex-1 bg-yellow-400" />,

              headerLeft: () => Platform.OS === 'ios' && <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onPress={() => router.back()}>
                <X color="white" />
              </Button>,
              headerRight: () => Platform.OS !== 'ios' && <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onPress={() => router.back()}>
                  <X color="#FFD500" />
                </Button>,
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
                headerBackground: () => Platform.OS !== 'ios' ? <View className="flex-1 bg-yellow-400" /> : undefined,
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
            Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined ,
                  headerShadowVisible: false,
          headerShown: true,

            }}
          />
        </Stack>

        <ActiveRideSheet />
      </RideProvider>
  );
}
