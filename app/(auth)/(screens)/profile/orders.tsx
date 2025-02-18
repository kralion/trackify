import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProductStore } from '@/store';
import { Product } from '@/types';
import { Pen, Trash } from 'lucide-react-native';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';


const Orders = () => {
  const { products, removeProduct } = useProductStore()

  const renderItem = ({ item }: { item: Product }) => (
    <View className="   flex-row items-center  gap-4  md:gap-8">
      <Image
        source={{ uri: item.image_url }}
        className="rounded-xl"
        style={{ marginRight: 10, width: 100, height: 100 }}
      />
      <View className="  flex-1">
        <View className="flex flex-col gap-2">
          <Text className="text-lg font-bold" style={{ fontFamily: "Lato" }}>{item.name} </Text>
          <Text className="text-gray-500">S/. {item.price} PEN x porcion</Text>

          <View className="flex-row items-center">

            <Text className="mx-2 text-lg">{item.quantity}</Text>

          </View>
        </View>
      </View>
      <View className='flex-row gap-4'>

        <Button
          size="icon"
          className="rounded-full"
          variant="secondary"
          onPress={() => {
            removeProduct(item.id);
          }}>
          <Pen size={18} />
        </Button>
        <Button
          size="icon"
          className="rounded-full"
          variant="destructive"
          onPress={() => {
            removeProduct(item.id);
          }}>
          <Trash color="white" size={18} />
        </Button>
      </View>
    </View>
  );

  return (
    <View className='web:md:w-1/2 mx-auto p-4'>
      <FlatList
        data={products}
        ItemSeparatorComponent={() => <Separator className="my-4 md:my-8" />}
        contentContainerClassName='px-4'
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Orders;