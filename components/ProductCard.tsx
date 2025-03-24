import { useCartStore } from "@/store";
import { Product } from "@/types";
import {  View, Text, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "./ui/button";
import { Plus } from "lucide-react-native";

export const ProductCard = ({ product }: { product: Omit<Product, 'quantity'> }) => {
  const { addItem } = useCartStore();
  return (
    <Animated.View entering={FadeIn.duration(500).damping(20)}>
      <View className="my-4 mr-8 flex w-64 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 h-[370px]">
        <Image source={{ uri: product.image_url }} className="h-44 w-full rounded-t-lg shadow" />

        <View className="flex flex-col  px-4">
          <Text className=" text-xl font-semibold text-muted-foreground " style={{ fontFamily: "Lato" }}>
            {product.name}
          </Text>
          <Text className=" text-sm text-muted-foreground" >
            {product.description}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between p-4">
          <Text className="  p-2 text-xl font-bold">S/ {product.price.toFixed(2)}</Text>
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