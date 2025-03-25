import { useSignUpStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

const signUpSchema = z.object({
  email: z.string().email("El correo electrónico es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { setClerkCredentials } = useSignUpStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {

    try {
      setIsLoading(true);
      setClerkCredentials({
        email: data.email,
        password: data.password,
      });

      router.push("/onboarding/auth/preference");
    } catch (err: any) {
      console.error(err);
      toast.error("Error al guardar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView>
        <View className="flex flex-col gap-8 h-screen-safe justify-center p-6 web:md:max-w-xl web:md:mx-auto">
          <View className="flex flex-col items-center">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../../../assets/logo.png")}
            />
            <Text className="text-4xl font-bold">Crear Cuenta</Text>
            <View>
              <Text className="text-center text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Text
                  className="text-primary font-semibold underline"
                  onPress={() => router.back()}
                >
                  Inicia sesión
                </Text>
              </Text>
            </View>
          </View>
           

          <View className="flex flex-col gap-4 w-full">
         

            <View>
              <Text className="font-medium mb-2">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="email@.com"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    size="lg"
                    autoCapitalize="none"
                    keyboardType="email-address"
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
                    value={value}
                    size="lg"
                    secureTextEntry
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
              disabled={isLoading || !!errors}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="absolute"
                />
              ) : (
                <Text>Continuar</Text>
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}