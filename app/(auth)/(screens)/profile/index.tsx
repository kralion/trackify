import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useColorScheme } from '@/lib/useColorScheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Bell, Boxes, ChevronRight, Fingerprint, Lock, Map, Moon, Notebook } from 'lucide-react-native';
import { colorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Appearance, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const { isDarkColorScheme } = useColorScheme();

  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress || '');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(isDarkColorScheme);

const handleToggleDarkMode = () => {
  setIsDarkMode(prevMode => !prevMode);
    const newColorScheme = isDarkMode ? 'light' : 'dark';
    Appearance.setColorScheme(newColorScheme);
};
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.emailAddresses[0].emailAddress || '');
    }
  }, [user]);


  async function handleSave() {
    try {
      setIsEditing(false);
      await user?.update({
        firstName,
        lastName,
      });
      toast.success('Cambios guardados');
    } catch (err) {
      console.error('Error updating user', err);
      toast.error('Error al guardar los cambios');
    }
  }

  return (
    <ScrollView
      className="p-4 bg-background"
      contentContainerClassName="pb-6 web:md:w-1/2 w-full mx-auto"
      contentInsetAdjustmentBehavior="automatic"
      >
      {isEditing ? (
        <View className="mb-6 flex flex-col items-center gap-4 rounded-2xl bg-background p-6 ">
          <Avatar
            alt="avatar"
            style={{
              width: 100,
              height: 100,
            }}>
            <AvatarImage
              source={{
                uri: user?.imageUrl,
              }}
            />
          </Avatar>
          <Input
            className="w-full"
            onChangeText={setFirstName}
            value={firstName}
            placeholder="First Name"
          />
          <Input
            className="w-full"
            onChangeText={setLastName}
            value={lastName}
            placeholder="Last Name"
          />
          <Input
            value={email}
            editable={false}
            className="w-full "
            placeholder="Email"
            keyboardType="email-address"
          />

          <Button  onPress={handleSave}>
            <Text>Guardar Cambios</Text>
          </Button>
          <Button variant="destructive" onPress={() => setIsEditing(false)}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      ) : (
        <View className="mb-6 items-center rounded-2xl bg-zinc-100 p-6">
          <Avatar
            alt="avatar"
            style={{
              width: 100,
              height: 100,
            }}>
            <AvatarImage
              source={{
                uri: user?.imageUrl,
              }}
            />
          </Avatar>
          <Text className="mt-2 text-xl font-bold" style={{ fontFamily: "Bold" }}>{user?.fullName}</Text>
          <Text className="text-gray-500">{user?.emailAddresses[0].emailAddress}</Text>
          <Button className="mt-4 " onPress={() => setIsEditing(true)}>
            <Text>Editar perfil</Text>
          </Button>
        </View>
      )}

      <Label className="m-2 ml-4  text-muted-foreground" >Productos</Label>
      <View className="mb-6 rounded-2xl bg-zinc-100 px-4">
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/(screens)/profile/products')}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Boxes color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>Mis productos</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-muted-foreground">148</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/(screens)/tracker')}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Map color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>Seguimientos</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-muted-foreground">148</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/(auth)/(screens)/profile/orders')}>
          <View className="flex-row items-center justify-between  border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Notebook color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>Mis Ordenes</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-muted-foreground">25</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Label className="m-2 ml-4 text-muted-foreground" >Preferencias</Label>
      <View className="mb-6 rounded-2xl bg-zinc-100 px-4">
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Bell color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>Notificaciones push</Text>
            </View>

            <Switch value={true} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Fingerprint color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>Face ID</Text>
            </View>
            <Switch value={true} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Moon color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>Modo Oscuro</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={handleToggleDarkMode} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Lock color="black" />
              <Text className="font-semibold" style={{ fontFamily: "Lato" }}>PIN Code</Text>
            </View>
            <Switch value={false} />
          </View>
        </TouchableOpacity>

      </View>

      <Button className="mt-4 " size="lg" variant="destructive" onPress={() => signOut()}>
        <Text className="text-white">Cerrar Sesión</Text>
      </Button>
    </ScrollView>
  );
}
