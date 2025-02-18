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

    router.push('/(auth)/(screens)/profile/products');
  };

  return (
    <View className='p-4 web:md:mx-auto web:md:w-1/2 flex-col gap-4 web:md:gap-8'>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Button className='flex flex-row gap-4' variant="outline">
            <UploadCloud color="gray" size={20} />
            <Text style={styles.imagePickerText}>Selecciona una imagen</Text>
          </Button>
        )}
      </TouchableOpacity>
      <View>
        <Label className="my-2 px-4 text-muted-foreground">Nombre </Label>
        <Input
          className="rounded-full"
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <Label className="my-2 mt-4 px-4 text-muted-foreground">Precio</Label>
        <View className="flex flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              className="rounded-full"
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

      <Button className='rounded-full' onPress={handleAddProduct}>
        <Text >Add Product</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#888',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProduct;