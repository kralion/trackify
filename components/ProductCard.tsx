import { useCartStore } from "@/store";
import { Product } from "@/types";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Image, View } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore();
  const [showProductAddedModal, setShowProductAddedModal] = useState(false);
  const [pizzaPrice, setPizzaPrice] = useState(0);
  const [pizzaSize, setPizzaSize] = useState("");
  const handleAddToCart = (price: number, size: string) => {
    setPizzaPrice(price);
    setPizzaSize(size);
    addItem({ ...product, quantity: 1, price: price, name: `${product.name} ${size}` });
  };
  return (
    <View className="my-4 mr-6  flex web:md:w-60 w-40  flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 web:md:h-[400px] ">
      <Image source={{ uri: product.image_url }} className="web:md:h-48 h-36  rounded-t-lg " />
      <ProductAddedModal show={showProductAddedModal} onClose={() => setShowProductAddedModal(false)} product={product} />



      <View className="flex flex-col  px-4 mt-2">
        <Text className=" web:md:text-xl text-md  font-semibold text-muted-foreground dark:text-foreground" style={{ fontFamily: "Lato" }}>
          {product.name}
        </Text>

        <Text className=" text-xs text-muted-foreground" >
          {product.description}
        </Text>
      </View>

      {product.price <= 0 ?
        <View className=" flex-row gap-2 flex-wrap p-4">
          <Button size="sm" onPress={() => handleAddToCart(12, "Personal")} className=" rounded-full">
            <Text>Personal </Text>
          </Button>
          <Button size="sm" onPress={() => handleAddToCart(20, "Biper")} className=" rounded-full px-5">
            <Text>Biper </Text>
          </Button>
          <Button size="sm" onPress={() => handleAddToCart(30, "Familiar")} className=" rounded-full">
            <Text>Familiar</Text>
          </Button>
        </View> : <View className="flex flex-row items-center justify-between p-2">

          <Text className="  p-2 web:md:text-2xl  text-xl font-bold">S/ {product.price.toFixed(2)}</Text>


          <Button
            size="icon"
            hitSlop={
              {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
              }
            }
            className=" rounded-full"
            onPress={() => {
              addItem({ ...product, quantity: 1 })
              setShowProductAddedModal(true);
            }}>
            <Plus color="white" size={18} />
          </Button>
        </View>}

    </View>
  );
};


function ProductAddedModal({ show, onClose, product }: { show: boolean, onClose: () => void, product: Product }) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className='sm:w-[425px]'>
        <DialogHeader>
          <DialogTitle>Producto Agregado</DialogTitle>

        </DialogHeader>
        <View className="flex flex-row items-center space-x-4">
          <Image source={{ uri: product.image_url }} className="h-16 w-16 rounded-full" />
          <View>
            <Text className="text-lg font-bold">{product.name}</Text>
            <Text className="text-sm text-muted-foreground">Cantidad: 1</Text>
          </View>
        </View>
        <Text className="">Precio: S/ {product.price.toFixed(2)}</Text>
        <DialogFooter>
          <Button onPress={() => { router.push('/cart'); onClose() }}>
            <Text>Ver Carrito</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}