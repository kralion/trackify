import { useCartStore } from "@/store";
import { Product } from "@/types";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Image, View } from "react-native";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { toast } from "sonner-native";

export const ProductCard = ({ product }: { product: Omit<Product, 'quantity'> }) => {
  const { addItem } = useCartStore();
  const [pizzaPrice, setPizzaPrice] = useState(0);
  const [pizzaSize, setPizzaSize] = useState("");
  const handleAddToCart = (price: number, size: string) => {
    setPizzaPrice(price);
    setPizzaSize(size);
    addItem({ ...product, quantity: 1, price: price, name: `${product.name} ${size}` });
  };
  return (
      <View className="my-4 mr-8 flex w-64 flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 md:h-[400px] h-[450px]">
        <Image source={{ uri: product.image_url }} className="md:h-48 h-64 w-full rounded-t-lg " />

        <View className="flex flex-col  px-4 gap-1">
          <Text className=" text-xl font-semibold text-muted-foreground dark:text-foreground" style={{ fontFamily: "Lato" }}>
            {product.name}
          </Text>

          <Text className=" text-sm text-muted-foreground" >
            {product.description}
          </Text>
        </View>
        
        {product.price <=0 ?
        <View className=" flex-row gap-2 flex-wrap p-4">
              <Button size="sm" onPress={() => handleAddToCart(12, "Personal")} className=" rounded-full">
                <Text>Personal </Text>
              </Button>
      <Button size="sm" onPress={() => handleAddToCart(20, "Biper")}  className=" rounded-full px-5">
                <Text>Biper </Text>
              </Button>
              <Button size="sm" onPress={() => handleAddToCart(30, "Familiar")} className=" rounded-full">
                <Text>Familiar</Text>
              </Button>
            </View>:<View className="flex flex-row items-center justify-between p-4">
          
            <Text className="  p-2 text-2xl font-bold">S/ {product.price.toFixed(2)}</Text>
         
          
          <Button
            size="icon"
            hitSlop={10}
            className=" rounded-full"
            onPress={() => {
              addItem({ ...product, quantity: 1 });
              toast.success("Producto agregado", {
                duration: 1000,
              });

            }}>
            <Plus color="white" size={18} />
          </Button>
        </View>}
      </View>
  );
};