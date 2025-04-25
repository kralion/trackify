import { CategoryItem } from '@/components/CategoryItem';
import { ProductCard } from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { useColorScheme } from '@/lib/useColorScheme';
import { useCategoryStore, useProductStore } from '@/store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ImageBackground, ActivityIndicator, Animated, FlatList, Image, RefreshControl, Text, useWindowDimensions, View } from 'react-native';

export default function HomeScreen() {
  const { query } = useLocalSearchParams();
  const { products, getProductsByCategoryOrSearch, loading: loadingProducts } = useProductStore();
  const { categories, getCategories, loading: loadingCategories } = useCategoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState<number | null>(1);
  const width = useWindowDimensions().width;
  const isMobile = width < 768;
  const scrollY = useRef(new Animated.Value(0)).current; // 🔥 Trackea el scroll vertical

  const translateY = scrollY.interpolate({
    inputRange: [0, 100], // Cuando scrolleas 100px, la cabecera desaparece
    outputRange: [0, activeCategory === 6 ? -100 : -150], // Se mueve hacia arriba
    extrapolate: "clamp", // Evita valores fuera del rango
  });

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
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>

        <Animated.View
          style={{
            transform: [{ translateY }],
            position: "absolute", // Fijamos en la parte superior
            top: 0,
            backgroundColor: "transparent",
            left: 0,
            paddingVertical: 16,
            right: 0,
            zIndex: 10,
          }}
        >

          <FlatList
            data={categories}

            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                active={activeCategory === item.id}
                onPress={() => setActiveCategory(item.id)}
              />
            )}
            ListEmptyComponent={() => loadingCategories
              ? <View className='items-center my-8 mx-auto'><ActivityIndicator color="white" /></View>
              : null
            }
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginBottom: 16, marginHorizontal: "auto" }}
          />


          {activeCategory === 6 && (



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

          )}

        </Animated.View>

        <Animated.FlatList
          contentContainerStyle={{ paddingBottom: 24, backgroundColor: "background", paddingTop: activeCategory === 6 ? 180 : 120, marginHorizontal: isMobile ? 0 : "auto" }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={loadingProducts ? (
            <View className='items-center my-16'>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : null}
          key={String(isMobile)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }], // Escucha el scroll
            { useNativeDriver: true }
          )}
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => String(item.id)}
          numColumns={isMobile ? 2 : 5}
        />
      </View>
    </ImageBackground>

  );
}
