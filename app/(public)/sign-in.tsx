import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Image, Platform, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS !== 'web') {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  return (
    <SafeAreaView
      className="h-screen flex-1 items-center justify-center"
      style={{ paddingHorizontal: 16 }}>
      <View className="mb-10 flex flex-col items-center gap-1">
        <Animated.Image
          style={{
            width: 150,
            height: 150,
          }}
          entering={FadeInDown.damping(5).duration(500)}
          source={{
            uri: 'https://img.icons8.com/?size=300&id=Jpr7XcQNM2FS&format=png&color=000000',
          }}
        />
        <Text className="text-center text-3xl font-bold">Bienvenido a Trackify</Text>
        <Text className="text-center text-muted-foreground">
          Vincula una de tus cuentas para continuar
        </Text>
      </View>
      <View className="mx-auto flex w-full flex-col justify-center gap-4 align-middle  web:md:w-2/3 web:lg:w-1/3">
        <SignInWithOAuthGoogle />
        <SignInWithOAuthFacebook />
        <SignInWithOAuthTiktok />
      </View>
    </SafeAreaView>
  );
}

export const SignInWithOAuthGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(screens)', { scheme: 'trackify' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row items-center gap-2 "
      variant="secondary"
      size="lg"
      onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: 'https://img.icons8.com/?size=96&id=17949&format=png',
        }}
        alt="google"
      />
      <Text className="text-black dark:text-black">Continuar con Google</Text>
    </Button>
  );
};
export const SignInWithOAuthTiktok = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_tiktok' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(screens)', { scheme: 'trackify' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row items-center gap-2 "
      variant="secondary"
      size="lg"
      onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/3046/3046121.png',
        }}
        alt="tiktok"
      />
      <Text className="text-black dark:text-black">Continuar con TikTok</Text>
    </Button>
  );
};
export const SignInWithOAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(screens)', { scheme: 'trackify' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row items-center gap-2 "
      variant="secondary"
      size="lg"
      onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/5968/5968764.png',
        }}
        alt="Facebook"
      />
      <Text className="text-black dark:text-black">Continuar con Facebook</Text>
    </Button>
  );
};
