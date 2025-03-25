import { useSignUpStore } from "@/store";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";



const preferencesSchema = z.object({
  location: z.string().min(1, "La ubicación es requerida"),
  phone: z
    .string()
    .length(9, "El número debe tener 9 dígitos")
    .regex(/^\d+$/, "Solo números permitidos")
    .optional(),
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El nombre es requerido"),
  
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function PreferencesScreen() {
  const {  signUp, setActive } = useSignUp()
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      location: "",
      phone: "",
      firstName: "",
      lastName: ""
    },
  });

  

  
 const onSubmit = async (data: PreferencesForm) => {
    try {
      setIsLoading(true);

      // Get credentials from store
      const { username, password } =
        useSignUpStore.getState();

      // Create Clerk user
      const signUpAttempt = await signUp?.create({
        username,
        password,
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          location: data.location,
          phone: `51${data.phone}`
        }
      });

      if (!signUpAttempt) {
        toast.error("Error al crear la cuenta");
        return;
      }

      if (signUpAttempt.status !== "complete") {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        toast.error("Error al crear la cuenta");
        return;
      }

      await setActive?.({
        session: signUpAttempt.createdSessionId,
      });

      router.replace("/(auth)/(screens)");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear el perfil");
    } finally {
      setIsLoading(false);
    }
  };
 

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="web:md:w-[500px] web:md:mx-auto"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex flex-col gap-12 p-6">
          <Button
            variant="secondary"
            className="rounded-full"
            size="icon"
            onPress={() => router.back()}
          >
            <ChevronLeft color="orange" size={24} />
          </Button>
          <View className="flex flex-col items-center">
            <Text className="text-4xl font-bold">Información personal</Text>
            <Text className="text-base text-muted-foreground text-center mt-2 px-10">
              Estos datos nos ayudaran para cuando realices pedidos
            </Text>
          </View>

          <View className="flex flex-col gap-4">
             <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                Nombres
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Alberto"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.firstName?.message && (
                <Text className="text-xs text-red-500">
                  {errors.firstName?.message}
                </Text>
              )}
            </View>
            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
               Apellidos
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Cartagena"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.lastName?.message && (
                <Text className="text-xs text-red-500">
                  {errors.lastName?.message}
                </Text>
              )}
            </View>
            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                ¿Lugar de residencia?
              </Text>
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Jr. Oswaldo N Regal - 546"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.location?.message && (
                <Text className="text-xs text-red-500">
                  {errors.location?.message}
                </Text>
              )}
            </View>

           

         

           
            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                Teléfono
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Ingresa tu número de teléfono"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    maxLength={9}
                  />
                )}
              />
              {errors.phone?.message && (
                <Text className="text-xs text-red-500">
                  {errors.phone?.message}
                </Text>
              )}
            </View>
          </View>

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
              <Text>Crear cuenta</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}