import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

const signInSchema = z.object({
  email: z.string().email("El correo electrónico es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn, setActive } = useSignIn();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      setIsLoading(true);
      const completeSignIn = await signIn?.create({
        strategy: "email_link",
      });

      if (completeSignIn?.status === "complete") {
        await setActive?.({
          session: completeSignIn.createdSessionId,
        });
      } else {
        toast.error("Hubo un error al iniciar sesión");
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={styles.container}
            className="flex flex-col gap-8 h-screen-safe justify-center p-6 web:md:max-w-xl web:md:mx-auto"
          >
            <View className="flex flex-col items-center">
              <Image
                style={{
                  width: 125,
                  height: 125,
                }}
                source={require("../../../../assets/logo.png")}
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
                <Text className="font-medium mb-2">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Nombre de usuario"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      size="lg"
                    />
                  )}
                />
                {errors.email?.message && (
                  <Text className="text-xs text-red-500">
                    {errors.email?.message}
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
                    onPress={() => router.push("/(public)/sign-up")}
                  >
                    Crea una cuenta
                  </Text>
                </Text>
              </View>
            </View>
            <View className="mt-10">
              <Text className="text-center text-muted-foreground web:md:text-sm">
                Al inciar sesión aceptas nuestros{" "}
                <Text className="text-primary font-semibold underline">
                  Términos y condiciones
                </Text>{" "}
                y nuestra{" "}
                <Text className="text-primary font-semibold underline">
                  Política de Privacidad
                </Text>
              </Text>
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