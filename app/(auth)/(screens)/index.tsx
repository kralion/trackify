import { CategoryItem } from '@/components/CategoryItem';
import { ProductCard } from '@/components/ProductCard';
import { useCategoryStore, useProductStore } from '@/store';
import { Product } from '@/types';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, useWindowDimensions, View } from 'react-native';




export default function HomeScreen() {
  const { query } = useLocalSearchParams();
  const { user } = useUser()
  const { products, getProductsByCategoryOrSearch, loading: loadingProducts } = useProductStore();
  const { categories, getCategories, loading: loadingCategories } = useCategoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  const width = useWindowDimensions().width;
  const isMobile = width < 768;
  
  useEffect(() => {
    getCategories(user?.id as string);
     
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

  }, [query]);

  useEffect(() => {
    getProductsByCategoryOrSearch(activeCategory, '', user?.id as string);

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
           ListEmptyComponent={() => loadingCategories ? <ActivityIndicator /> :  <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron categorías
                </Text>
              </View>}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{  marginBottom: 16 }}
          />
         
          
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Clásicos</Text>

          <FlatList
            key={String(isMobile)}
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            numColumns={isMobile ? 1 : 4}
           ListEmptyComponent={() => loadingProducts ? <ActivityIndicator /> : <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>}
            horizontal={isMobile}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
        </View>
      </ScrollView>

  );
}
