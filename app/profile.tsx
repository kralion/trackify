import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/lib/useColorScheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { MapPin, Phone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.unsafeMetadata.phone || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [location, setLocation] = useState(user?.unsafeMetadata.location || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setPhone(user.unsafeMetadata.phone || '');
      setLocation(user.unsafeMetadata.location || '');
    }
  }, [user]);


  async function handleSave() {
    try {
      setIsEditing(false);
      await user?.update({
        firstName,
        lastName,
        unsafeMetadata: {
          location,
          phone
        }
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
        <View className="mb-6 flex flex-col items-center gap-4 rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900">
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
          <View className='flex flex-col gap-2 w-full'>
            <Input
              size='lg'
              className="w-full"
              onChangeText={setFirstName}
              value={firstName}
              placeholder="First Name"
            />
            <Input
              size='lg'

              className="w-full"
              onChangeText={setLastName}
              value={lastName}
              placeholder="Last Name"
            />
            <Input
              size='lg'

              className="w-full"
              onChangeText={setLocation}
              value={location as string}
              placeholder="Jr. Oswaldo N Regal 485"
            />
            <Input
              size='lg'
              className="w-full"
              onChangeText={setPhone}
              maxLength={9}
              value={phone as string}
              placeholder="914151151"
            />
          </View>

          <Button onPress={handleSave}>
            <Text>Guardar Cambios</Text>
          </Button>
          <Button variant="destructive" onPress={() => setIsEditing(false)}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      ) : (
        <>
          <View className="mb-6 items-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-6">
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
            <Text className="text-gray-500">{user?.username}</Text>

            <Button className="mt-4 " onPress={() => setIsEditing(true)}>
              <Text>Editar perfil</Text>
            </Button>
          </View>
          <View>


            <Label className="m-2 ml-4  text-muted-foreground" >Ubicación</Label>
            <View className="mb-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4">
              <View className="flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 py-4">
                <View className="flex flex-row items-center gap-4">
                  <MapPin color={isDarkColorScheme ? 'white' : 'black'} />
                  <Text className="font-semibold" style={{ fontFamily: "Lato" }}>{user?.unsafeMetadata.location as string}</Text>
                </View>
              </View>
            </View>
            <Label className="m-2 ml-4  text-muted-foreground" >Teléfono</Label>
            <View className="mb-6 rounded-2xl bg-zinc-100 px-4 dark:bg-zinc-900">
              <View className="flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 py-4">
                <View className="flex flex-row items-center gap-4">
                  <Phone color={isDarkColorScheme ? 'white' : 'black'} />
                  <Text className="font-semibold" style={{ fontFamily: "Lato" }}>{user?.unsafeMetadata.phone as string}</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}


      <Button className="mt-4 " size="lg" variant="destructive" onPress={() => { signOut(); router.replace('/') }}>
        <Text className="text-white">Cerrar Sesión</Text>
      </Button>
    </ScrollView>
  );
}
