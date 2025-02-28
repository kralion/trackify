import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { useCartStore, useCategoryStore, useProductStore } from '@/store';
import { Category, Product } from '@/types';
import { Plus } from 'lucide-react-native';
import { FlatList } from 'react-native';
import { toast } from 'sonner-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
    className={`mr-8 flex w-28 flex-col items-center gap-4 rounded-xl  p-2 ${active ? 'bg-primary ' : 'bg-zinc-100'}`}>
    <Text className="text-5xl">{category.icon}</Text>
    <Text className={`text-sm ${active ? 'text-white' : 'text-muted-foreground'}`} >
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
              toast.success('Item agregado al carrito', {
                duration: 1000,
              });
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
  const { products, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState(1);
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);
  useEffect(() => {
    if (query) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(query.toString().toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [query]);
  const handleCategoryPress = (id: number) => {
    setActiveCategory(id);
    if (id === 1) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.id_category === id));
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFE0', '#FAFAD2']}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pb-24 md:mx-auto ">
        <View className="md:hidden">
          <Button
            className="mx-4 my-2 rounded-full "
            size="lg"
            onPress={() => router.push({ pathname: '/(auth)/(screens)/tracker' })}
            accessibilityLabel="Enviar pedido">
            <Text>Seguimiento Detallado</Text>
          </Button>
          <Button
            className="mx-4 my-2 rounded-full"
            size="lg"
            onPress={() => router.push({ pathname: '/(auth)/(screens)/map-tracking' })}
            accessibilityLabel="Enviar pedido">
            <Text>Seguimiento en Mapa</Text>
          </Button>
        </View>
        <View className="flex flex-col gap-4 py-4">
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Categorías</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                active={activeCategory === item.id}
                onPress={() => handleCategoryPress(item.id)}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16 }}
          />
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Más Pedidos</Text>
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            ListEmptyComponent={() => (
              <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Agregados Recientes</Text>

          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            ListEmptyComponent={() => (
              <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
          <Text className="px-4 uppercase text-muted-foreground text-lg font-bold" style={{ fontFamily: "Bold" }}>Clásicos</Text>

          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            ListEmptyComponent={() => (
              <View className='flex-col gap-2 items-center my-8'>
                <Image source={{ uri: "https://img.icons8.com/?size=200&id=BkgItq3pNAZa&format=png&color=000000" }} style={{
                  width: 70,
                  height: 70

                }} />
                <Text className="px-8 text-muted-foreground">
                  No se encontraron productos
                </Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
