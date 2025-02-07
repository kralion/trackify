import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Boxes, ChevronRight, Notebook, Bell, Fingerprint, Lock } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { ScrollView, Switch, Text, View } from 'react-native';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  return (
    <ScrollView className="p-4 " contentInsetAdjustmentBehavior="automatic">
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
        <Button className="mt-4 rounded-full">
          <Text>Editar perfil</Text>
        </Button>
      </View>

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
