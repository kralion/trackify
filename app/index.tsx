import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { Image, Linking, ScrollView, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiImage } from 'moti';
import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';

interface Chef {
  name: string;
  photo: string;
  welcome: string;
}

const TAGS = [
  'Platos Chifa',
  'Caldos',
  'Burgers',
  'Pizzas',
  'Bebidas',
  'Broster',
  'Alitas',
];

const CHEFS: Chef[] = [
  {
    name: 'Chef Lucía Chen',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    welcome: '¡Bienvenidos a nuestra fusión de sabores orientales y peruanos! Disfruten cada bocado.',
  },
  {
    name: 'Chef Mateo López',
    photo: 'https://randomuser.me/api/portraits/men/46.jpg',
    welcome: 'Cocinar es mi pasión y mi arte. Espero que cada plato sea una experiencia inolvidable.',
  },
  {
    name: 'Chef Camila Torres',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    welcome: 'Nuestra cocina está hecha con amor y los mejores ingredientes. ¡Buen provecho!',
  },
  {
    name: 'Chef Diego Ríos',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    welcome: 'Bienvenidos a casa. Aquí, cada receta cuenta una historia familiar.',
  },
];

export default function LandingHome() {
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName=" web:md:px-0 "
      showsVerticalScrollIndicator={false}
      accessible
      accessibilityLabel="Restaurant landing page"
    >
      {/* Layered Gradient Background */}
      <LinearGradient
        colors={['#fbbf24', '#f87171', '#a78bfa']}
        className="absolute left-0 right-0 top-0 h-96 opacity-60"
        pointerEvents="none"
      />

      {/* Hero Section */}
      <View className="mt-10 mb-10 flex flex-col items-center justify-center">
        {/* Animated Floating Chef Hat */}
        <MotiImage
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }}
          style={{ width: 90, height: 90 }}
          from={{ translateY: -20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 900 }}
          className="mb-3"
          accessibilityLabel="Chef hat logo"
        />
        {/* Animated Restaurant Name */}
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          className="mb-2"
        >
          <Text className="text-4xl font-extrabold text-center text-zinc-900 dark:text-zinc-50" accessibilityRole="header">
            Tito's Restaurant
          </Text>
        </MotiView>
        {/* Animated Tagline */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', delay: 400 }}
        >
          <Text className="text-lg font-medium text-center text-zinc-700 dark:text-zinc-200 mb-3">

            Sabor que encanta
          </Text>
        </MotiView>
        {/* Animated Social Proof */}
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', delay: 600 }}
          className="mb-3"
        >
          <View className="bg-emerald-100 dark:bg-emerald-800 px-4 py-1 rounded-full flex flex-row items-center mx-auto">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616494.png' }} style={{ width: 20, height: 20, marginRight: 6 }} />
            <Text className="text-emerald-700 dark:text-emerald-200 font-semibold text-sm">Loved by 10,000+ foodies</Text>
          </View>
        </MotiView>
        {/* Animated Tags */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', delay: 800 }}
          className="flex flex-row flex-wrap gap-2 justify-center mb-6"
        >
          {TAGS.map((tag) => (
            <View
              key={tag}
              className="bg-zinc-200 dark:bg-zinc-700 px-3 py-1 rounded-full"
              accessibilityLabel={tag}
            >
              <Text className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{tag}</Text>
            </View>
          ))}
        </MotiView>
        {/* Animated Hero Image */}
        <MotiImage
          source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' }}
          style={{ width: 340, height: 180, borderRadius: 24, marginTop: 10 }}
          from={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', delay: 1000 }}
          className="shadow-lg"
          accessibilityLabel="Signature truffle pasta dish hero image"
        />
        {/* Animated CTA Button */}
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 1200 }}
          className="mt-8"
        >
          <Button
            onPress={() => router.push('/(cart)')}
            className="w-56 bg-primary text-zinc-50 py-4 text-xl shadow-xl"
            accessibilityLabel="Start your order"
            accessibilityRole="button"
          >
            <Text className="text-xl font-bold">Start Your Order</Text>
          </Button>
        </MotiView>
      </View>

      {/* Restaurant Story */}
      <View className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-6 mb-8 shadow-sm web:md:w-4/5 web:md:mx-auto mx-4">
        <Text className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Nuestra Historia</Text>
        <Text className="text-zinc-700 dark:text-zinc-300 text-base">
          Fundada por artistas culinarios, Truffle & Thyme une los mejores ingredientes locales y técnicas globales. Nuestra pasión es crear experiencias gastronómicas memorables, ya sea que estés celebrando o simplemente disfrutando de una noche fuera.
        </Text>
      </View>

      {/* Chef Carousel */}
      <Text className="text-xl font-bold mb-3 text-orange-500 dark:text-orange-300 px-4">Conóce a nuestra familia</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-8 flex flex-row gap-4 px-1"
        accessibilityLabel="Chef carousel"
      >
        {CHEFS.map((chef: Chef, idx: number) => (
          <MotiView
            key={chef.name}
            from={{ translateY: 30, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', delay: 100 * idx }}
            className="bg-white dark:bg-zinc-900 rounded-2xl  py-4 mx-2 w-64 items-center"
            accessibilityLabel={`Chef ${chef.name}`}
          >
            <Image
              source={{ uri: chef.photo }}
              style={{ width: 80, height: 80, borderRadius: 36, marginBottom: 10, borderWidth: 3, borderColor: '#fbbf24' }}
              accessibilityLabel={`${chef.name} photo`}
            />
            <Text className="font-bold text-lg text-orange-500 mb-1">{chef.name}</Text>
            <Text className="italic text-zinc-600 dark:text-zinc-300 text-center">“{chef.welcome}”</Text>
          </MotiView>
        ))}
      </ScrollView>

      {/* Awards Box */}
      <View className="bg-orange-100 dark:bg-orange-900  py-6 mb-8  web:md:w-4/5 web:md:mx-auto  items-center">
        <Text className="text-lg font-bold text-orange-600 dark:text-orange-200 mb-2">Reconocimientos</Text>
        <View className="flex flex-row flex-wrap gap-4 pt-8 justify-center items-center">
          <View className="flex flex-col items-center">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }} style={{ width: 36, height: 36 }} accessibilityLabel="Michelin Star" />
            <Text className="text-xs mt-1 text-orange-700 dark:text-orange-200">Michelin Star</Text>
          </View>
          <View className="flex flex-col items-center">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={{ width: 36, height: 36 }} accessibilityLabel="Best Chef" />
            <Text className="text-xs mt-1 text-orange-700 dark:text-orange-200">Best Chef 2024</Text>
          </View>
          <View className="flex flex-col items-center">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png' }} style={{ width: 36, height: 36 }} accessibilityLabel="Top Restaurant" />
            <Text className="text-xs mt-1 text-orange-700 dark:text-orange-200">Top Restaurant</Text>
          </View>
          <View className="flex flex-col items-center">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png' }} style={{ width: 36, height: 36 }} accessibilityLabel="Customer Choice" />
            <Text className="text-xs mt-1 text-orange-700 dark:text-orange-200">Customer Choice</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="mt-2 py-6  dark:bg-zinc-800 rounded-2xl shadow-inner web:md:w-4/5 web:md:mx-auto  items-center">
        <View className="flex flex-row gap-6 mb-8">
          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/titos_oficialll')} accessibilityLabel="Instagram">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' }} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/profile.php?.id=100063538481382')} accessibilityLabel="Facebook">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' }} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://tiktok.com/@titoshuanta')} accessibilityLabel="TikTok">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3046/3046121.png' }} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/51966137450')} accessibilityLabel="WhatsApp">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' }} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
        </View>
        <Text className=" text-zinc-500 dark:text-zinc-300">Jr. Fredy Valladares 104, Huanta</Text>
        <Text className="text-xs text-zinc-500 dark:text-zinc-300 mt-1">Horario 04:00 PM –11:00 PM · Todos los días</Text>
      </View>
    </ScrollView>
  );
}

