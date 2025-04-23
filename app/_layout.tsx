import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { router, Slot, SplashScreen, Stack, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import '~/global.css';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { Toaster } from 'sonner-native';

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
  return (
    <Stack screenOptions={{ headerShown: false }} />

  );
}
