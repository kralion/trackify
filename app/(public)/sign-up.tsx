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
  username: z.string().min(6, "El usuario debe tener al menos 6 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  repeatPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
}).superRefine((data, ctx) => {
  if (data.password !== data.repeatPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Las contraseñas no coinciden",
      path: ["repeatPassword"], 
    });
  }
});







type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { setClerkCredentials } = useSignUpStore();
  const [passwordsMatch, setPasswordsMatch] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setPasswordsMatch(data.password === data.repeatPassword);
    if (!passwordsMatch) {
      return;
    }

    try {
      setIsLoading(true);
      setClerkCredentials({
        username: data.username,
        password: data.password,
      });

      router.push("/(public)/preference");
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
        <View className="flex flex-col gap-8 h-screen-safe justify-center p-6 web:md:w-[500px] web:md:mx-auto">
          <View className="flex flex-col items-center">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/logo.png")}
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
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.username?.message && (
                <Text className="text-xs text-red-500 mt-2">
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
                    autoCapitalize="none"
                    onBlur={onBlur}
                    value={value}
                    size="lg"
                    secureTextEntry
                  />
                )}
              />
              {errors.password?.message && (
                <Text className="text-xs text-red-500 mt-2">
                  {errors.password?.message}
                </Text>
              )}
            </View>
            <View>
              <Text className="font-medium mb-2">Repetir Contraseña</Text>
             <Controller
  control={control}
  name="repeatPassword"
  render={({ field: { onChange, onBlur, value } }) => (
    <View className="flex flex-col gap-2">
      <Input
        placeholder="********"
        onChangeText={onChange}
        autoCapitalize="none"
        onBlur={onBlur}
        value={value}
        size="lg"
        secureTextEntry
      />
      {errors.repeatPassword?.message && (
        <Text className="text-xs text-red-500 mt-2">
          {errors.repeatPassword?.message}
        </Text>
      )}
    </View>
  )}
/>
              
              
            </View>
          </View>

          <View className="flex flex-col gap-4">
            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
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