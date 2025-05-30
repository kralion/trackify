import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

const signInSchema = z.object({
  username: z.string().min(1, "El correo electrónico es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn, setActive, isLoaded } = useSignIn()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = React.useCallback(async (data: SignInForm) => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      console.log("hello");
      const signInAttempt = await signIn.create({
        identifier: data.username,
        password: data.password,
        strategy: "password"
      });
      console.log("hello2", signInAttempt);

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, setActive, router]);

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView>
        <Button className="mt-4 gap-1  flex w-28 flex-row  items-center justify-start" variant="ghost" onPress={() => router.back()}><ChevronLeft color="orange" />
          <Text className="font-semibold text-orange-500">Ver Menú</Text>
        </Button>
        <View
          style={styles.container}
          className="flex flex-col gap-8  justify-center p-6 web:md:w-[500px] web:md:mx-auto"
        >
          <View className="flex flex-col items-center">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/logo.png")}
            />
            <Text className="text-4xl font-bold">Bienvenido</Text>
            <Text className="text-center text-muted-foreground">
              Inicia sesión en tu cuenta de{" "}
              <Text className="font-semibold">Tito's</Text>
            </Text>
          </View>

          <View
            className="flex flex-col gap-4
               w-full"
          >
            <View>
              <Text className="font-medium mb-2">Usuario</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="miguel1234"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    size="lg"
                  />
                )}
              />
              {errors.username?.message && (
                <Text className="text-xs text-red-500">
                  {errors.username?.message}
                </Text>
              )}
            </View>
            <View>
              <Text className="font-medium mb-2">Contraseña</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="********"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    size="lg"
                    value={value}
                    secureTextEntry
                    className="bg-white"
                  />
                )}
              />
              {errors.password?.message && (
                <Text className="text-xs text-red-500">
                  {errors.password?.message}
                </Text>
              )}
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="absolute"
                />
              ) : (
                <Text>Iniciar sesión</Text>
              )}
            </Button>

            <View>
              <Text className="text-center text-muted-foreground">
                ¿Nuevo en la Web?{" "}
                <Text
                  className="text-primary font-semibold underline"
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  Crea una cuenta
                </Text>
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
});