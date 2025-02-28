import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react-native';

const AddProduct = () => {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = () => {
    console.log('Product Name:', name);
    console.log('Description:', description);
    console.log('Price:', price);
    console.log('Image:', image);

    router.back();
  };

  return (
    <View className='p-4 web:md:mx-auto web:md:w-1/2 flex-col gap-8'>

      <TouchableOpacity className='h-40 w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground bg-muted' onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={{
            height: 100,
            width: 100
          }} />
        ) : (
          <Button className='flex flex-row gap-4' variant="outline">
            <UploadCloud color="gray" size={20} />
            <Text className='text-lg text-muted-foreground'>Selecciona una imagen</Text>
          </Button>
        )}
      </TouchableOpacity>
      <View>
        <Label className="my-2 px-4 text-muted-foreground">Nombre </Label>
        <Input
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <Label className="my-2 mt-4 px-4 text-muted-foreground">Precio</Label>
        <View className="flex flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              placeholder="S/. 50.00"
              value={
                price
              }
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

        </View>
      </View>

      <Button size="lg" onPress={handleAddProduct}>
        <Text >Agregar Producto</Text>
      </Button>
    </View>
  );
};


export default AddProduct;