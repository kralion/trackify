import { useCartStore } from "@/store";
import { Product } from "@/types";
import { Plus } from "lucide-react-native";
import { Image, Text, View } from "react-native";
import { Button } from "./ui/button";

export const ProductCard = ({ product }: { product: Omit<Product, 'quantity'> }) => {
  const { addItem } = useCartStore();
  return (
      <View className="my-4 mr-8 flex w-64 flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 md:h-[370px] h-[450px]">
        <Image source={{ uri: product.image_url }} className="md:h-48 h-64 w-full rounded-t-lg " />

        <View className="flex flex-col  px-4 gap-1">
          <Text className=" text-xl font-semibold text-muted-foreground " style={{ fontFamily: "Lato" }}>
            {product.name}
          </Text>
          <Text className=" text-sm text-muted-foreground" >
            {product.description}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between p-4">
          <Text className="  p-2 text-2xl font-bold">S/ {product.price.toFixed(2)}</Text>
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
  );
};