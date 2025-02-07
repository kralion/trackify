import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Bell, Boxes, ChevronRight, Fingerprint, Lock, Notebook } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress || '');
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
      className="p-4 "
      contentContainerClassName="pb-20"
      contentInsetAdjustmentBehavior="automatic">
      {isEditing ? (
        <View className="mb-6 flex flex-col items-center gap-4 rounded-2xl bg-zinc-100 p-6 ">
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
          <Button className="rounded-full" onPress={handleSave}>
            <Text>Guardar Cambios</Text>
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
          <Text className="mt-2 text-xl font-bold">{user?.fullName}</Text>
          <Text className="text-gray-500">{user?.emailAddresses[0].emailAddress}</Text>
          <Button className="mt-4 rounded-full" onPress={() => setIsEditing(true)}>
            <Text>Editar perfil</Text>
          </Button>
        </View>
      )}

      <Label className="m-2 ml-4  text-muted-foreground">Productos</Label>
      <View className="mb-6 rounded-2xl bg-zinc-100 p-4">
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Boxes color="black" />
              <Text className="font-semibold">Mis productos</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-muted-foreground">148</Text>
              <ChevronRight color="gray" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between  border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Notebook color="black" />
              <Text className="font-semibold">Mis Ordenes</Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-muted-foreground">25</Text>
              <ChevronRight color="gray" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Label className="m-2 ml-4 text-muted-foreground">Preferencias</Label>
      <View className="mb-6 rounded-2xl bg-zinc-100 p-4">
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Bell color="black" />
              <Text className="font-semibold">Notificaciones push</Text>
            </View>

            <Switch value={true} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-b border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Fingerprint color="black" />
              <Text className="font-semibold">Face ID</Text>
            </View>
            <Switch value={true} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View className="flex-row items-center justify-between border-gray-200 py-4">
            <View className="flex flex-row items-center gap-4">
              <Lock color="black" />
              <Text className="font-semibold">PIN Code</Text>
            </View>
            <Switch value={false} />
          </View>
        </TouchableOpacity>
      </View>

      <Button className="mt-4 rounded-full" variant="destructive" onPress={() => signOut()}>
        <Text className="text-white">Cerrar Sesión</Text>
      </Button>
    </ScrollView>
  );
}
