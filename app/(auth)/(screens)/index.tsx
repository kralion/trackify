import { CategoryItem } from '@/components/CategoryItem';
import { ProductCard } from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { useCategoryStore, useProductStore } from '@/store';
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
    getCategories();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    if (query) {
      await getProductsByCategoryOrSearch(null, query as string,);

    } else {
      await getProductsByCategoryOrSearch(activeCategory, '');

    }
    setRefreshing(false);
  }

  useEffect(() => {
    if (query) {
      getProductsByCategoryOrSearch(null, query as string);
    }
  }, [query]);

  useEffect(() => {
    if (activeCategory) {
      getProductsByCategoryOrSearch(activeCategory, '');
    }
  }, [activeCategory]);

  return (


    <View className='flex-1'>
      <View className='flex-col gap-2  bg-transparent py-4'>
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
          ListEmptyComponent={() => loadingCategories ? <ActivityIndicator /> : <View className='flex-col gap-2 items-center my-8'>
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
          contentContainerStyle={{ marginBottom: 16 }}
        />


        {activeCategory === 6 && (
          <View className='flex flex-col gap-4 pb-4'>

            <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Pizzas</Text>
            <View className='ml-4 flex flex-row flex-wrap gap-2'>
              <Badge variant="secondary">
                <Text className=' web:md:text-lg dark:text-foreground'>Personal s/. 15.00</Text>
              </Badge>
              <Badge variant="secondary">
                <Text className=' web:md:text-lg dark:text-foreground'>Biper s/. 20.00</Text>
              </Badge>
              <Badge variant="secondary">
                <Text className='  web:md:text-lg dark:text-foreground'>Familiar s/. 30.00</Text>
              </Badge>
            </View>
          </View>
        )}
      </View>
      <FlatList contentContainerClassName="pb-24 bg-background md:mx-auto "
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={loadingProducts ? <ActivityIndicator size="large" className='my-16' /> : null}
        key={String(isMobile)}
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => String(item.id)}
        numColumns={isMobile ? 2 : 5}
        ListEmptyComponent={() => <View className='flex-col gap-2 items-center my-8'>
          <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
            width: 70,
            height: 70

          }} />
          <Text className="px-8 text-muted-foreground">
            No se encontraron productos
          </Text>
        </View>}

        contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
      />
    </View>


  );
}
