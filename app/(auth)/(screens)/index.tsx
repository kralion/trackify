import { Button } from '@/components/ui/button';
import { useCartStore, useCategoryStore, useProductStore } from '@/store';
import { Category, Product } from '@/types';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const CategoryItem = ({
  category,
  active,
  onPress,
}: {
  category: Category;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex w-24 flex-col items-center gap-1 `}>
      <View className={`rounded-full  p-2 ${active ? 'bg-primary/70 ' : 'bg-zinc-100'} `}>

    <Image source={{ uri: category.icon }} style={{ width: 40, height: 40 }} />
      </View>
    <Text className={`text-sm ${active ? '' : 'text-muted-foreground'}`} >
      {category.name === 'N/A' ? 'Todos' : category.name}
    </Text>
  </TouchableOpacity>
);

const ProductCard = ({ product }: { product: Omit<Product, 'quantity'> }) => {
  const { addItem } = useCartStore();
  return (
    <Animated.View entering={FadeIn.duration(500).damping(20)}>
      <View className="my-2 mr-6 flex w-56 flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 ">
        <Image source={{ uri: product.image_url }} className="h-36 w-full rounded-t-lg shadow" />

        <View className="flex flex-col gap-2">
          <Text className="text-center text-xl font-semibold text-muted-foreground" style={{ fontFamily: "Lato" }}>
            {product.name}
          </Text>
          <Text className="text-center text-sm text-muted-foreground" >
            {product.categories?.name}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between p-4">
          <Text className="  p-2 text-xl font-bold">S/ {product.price}</Text>
          <Button
            size="icon"
            hitSlop={10}
            className=" rounded-full"
            onPress={() => {
              addItem({ ...product, quantity: 1 });

            }}>
            <Plus color="white" size={18} />
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { query } = useLocalSearchParams();
  const { user } = useUser()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { products, getProductsByCategoryOrSearch, loading, getAllProductByUser } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  useEffect(() => {
    getCategories();
    if (query) {
      getProductsByCategoryOrSearch(null, query as string, user?.id as string);
    } else {
     getAllProductByUser(user?.id as string).then((products) => {
       setAllProducts(products)
     })
    }
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    if (query) {
      await getProductsByCategoryOrSearch(null, query as string, user?.id as string);

    } else {
      await getProductsByCategoryOrSearch(activeCategory, '', user?.id as string);

    }
    setRefreshing(false);
  }

  useEffect(() => {
    getProductsByCategoryOrSearch(null, query as string, user?.id as string);
    console.log("PRODUCTS: ", products)

  }, [query]);

  useEffect(() => {
    getProductsByCategoryOrSearch(activeCategory, '', user?.id as string);
    console.log("PRODUCTS: ", products)

  }, [activeCategory]);

  return (

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerClassName="pb-24 bg-background md:mx-auto ">
        <View className="flex flex-col gap-4 py-4">
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Categorías</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                active={activeCategory === item.id}
                onPress={() => setActiveCategory(item.id)}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{  marginBottom: 16 }}
          />
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Más Pedidos</Text>
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            ListEmptyComponent={() => loading ?  <ActivityIndicator  />  : <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Agregados Recientes</Text>

          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            ListEmptyComponent={() => loading ? <ActivityIndicator /> : <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Clásicos</Text>

          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
           ListEmptyComponent={() => loading ? <ActivityIndicator /> : <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
        </View>
      </ScrollView>

  );
}
