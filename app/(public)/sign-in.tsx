import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import React from 'react';
import { Image, Platform, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={['#F5D076', '#F0C25F']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="h-screen-safe relative mx-auto flex flex-col justify-center gap-8 web:pt-32 web:md:w-1/3">
          <View className="flex flex-col items-center gap-1 px-4">
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
          <View className="flex w-full flex-col justify-center gap-4 p-4 align-middle">
            <SignInWithOAuthGoogle />
            <SignInWithOAuthFacebook />
            <SignInWithOAuthTiktok />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
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
      className="flex flex-row items-center gap-2 rounded-full"
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
      className="flex flex-row items-center gap-2 rounded-full"
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
      className="flex flex-row items-center gap-2 rounded-full"
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
