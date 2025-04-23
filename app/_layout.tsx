import ShoppingCartIcon from '@/components/ShoppingCartIcon';
import { ThemeToggle } from '@/components/ThemeToogle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { ClerkLoaded, ClerkProvider, useUser } from '@clerk/clerk-expo';
import { Lato_400Regular, Lato_700Bold, useFonts } from '@expo-google-fonts/lato';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { router, SplashScreen, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import { User } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, NativeSyntheticEvent, Platform, TextInputFocusEventData, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import '~/global.css';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,

};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from 'expo-router';

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const width = useWindowDimensions().width;
  const isMobile = width < 768;
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fontLoaded, fontError] = useFonts({
    Lato: Lato_400Regular,
    Bold: Lato_700Bold,
  });
  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        document.documentElement.classList.add('bg-background');
      }
      if (fontLoaded || fontError) {
        SplashScreen.hideAsync();
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hide();
      setIsLoading(false);
    });
  }, []);

  if (!isColorSchemeLoaded && !fontError && !fontLoaded) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <GestureHandlerRootView>

      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          <ClerkLoaded>
            <RootLayoutNav />
            <PortalHost />
          </ClerkLoaded>
          <Toaster style={{ width: isMobile ? '100%' : '30%', marginHorizontal: 'auto' }} />
        </ThemeProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { user } = useUser();
  const [search, setSearch] = React.useState('');


  const handleSearchDebounce = debounce((text: string) => {
    router.setParams({
      query: text,
    });
  }, 500);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tito\'s Menú',
          headerTitleStyle:
            Platform.OS === 'web' ? { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" } : undefined,
          headerLargeTitle: true,
          headerShown: true,
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
                    onPress={() => router.push('/profile')}>
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
                    onPress={() => router.push('/(auth)/sign-in')}>
                    <User color="black" />
                  </TouchableOpacity>

              }
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="cart"
        options={{
          title: 'Pedido',
          headerTitleStyle:
            Platform.OS === 'web' && { fontSize: 24, fontWeight: 'bold', fontFamily: "Bold" },


        }}
      />

      <Stack.Screen
        name="profile"
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
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>

  );
}
