import { useCartStore } from "@/store";
import { Product } from "@/types";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import React from "react";
import { DrinkCustomizationModal } from "./DrinkCustomizationModal";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { BurgerCustomizationModal } from "./BurgerCustomizationModal";

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
    <TouchableOpacity className="my-4 w-1/2 web:md:mr-4 flex web:md:w-60   flex-col justify-between rounded-xl web:md:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm web:md:shadow-none web:md:h-[400px] web:md:hover:scale-105  active:scale-[0.98] focus-within:ring-2 focus-within:ring-primary duration-100 transition-all ease-linear cursor-pointer hover:shadow-lg" onPress={() => setShowProductAddedModal(true)}>

      <Image source={{ uri: product.image_url }} className="web:md:h-48 h-36  rounded-t-lg " />
      <ProductAddedModal show={showProductAddedModal} onClose={() => setShowProductAddedModal(false)} product={product} />


      <View className="flex flex-col  px-4 mt-2">
        <Text className=" web:md:text-xl text-md  font-semibold text-muted-foreground dark:text-foreground" style={{ fontFamily: "Lato" }}>
          {product.name}
        </Text>

        <Text className=" web:md:text-sm text-xs text-muted-foreground" >
          {product.description}
        </Text>
      </View>

      {product.price <= 0 ?
        <View className=" flex-row gap-2 flex-wrap p-4">
          <Button size="sm" onPress={() => { handleAddToCart(12, "Personal"), setShowProductAddedModal(true) }} className=" rounded-full">
            <Text>Personal </Text>
          </Button>
          <Button size="sm" onPress={() => { handleAddToCart(20, "Biper"), setShowProductAddedModal(true) }} className=" rounded-full px-5">
            <Text>Biper </Text>
          </Button>
          <Button size="sm" onPress={() => { handleAddToCart(30, "Familiar"), setShowProductAddedModal(true) }} className=" rounded-full">
            <Text>Familiar</Text>
          </Button>
        </View> : <View className="flex flex-row items-center justify-between p-2">

          <Text className="  p-2 web:md:text-2xl  text-xl font-bold">S/ {product.price.toFixed(2)}</Text>



        </View>}


    </TouchableOpacity>
  );
};



function ProductAddedModal({ show, onClose, product }: { show: boolean; onClose: () => void; product: Product }) {
  // Si es hamburguesa (category === 5), muestra el modal de personalización
  if (product.categories?.id === 5) {
    return (
      <BurgerCustomizationModal show={show} onClose={onClose} product={product} />
    );
  }
  // Si es bebida (category === 7) Y NO es id 74 ni 76, muestra el modal de personalización de bebidas
  if (product.categories?.id === 7 && product.id !== 74 && product.id !== 76) {
    return (
      <DrinkCustomizationModal show={show} onClose={onClose} product={product} />
    );
  }
  // Modal simple para otros productos
  const { addItem } = useCartStore();
  const [notes, setNotes] = React.useState<string>(""); // Define correctamente el estado notes y setNotes
  const handleAddToCart = () => {
    const added = addItem({
      ...product,
      quantity: 1,
      customizations: notes ? { notas: notes } : undefined,
    });
    setNotes("");
    onClose();
    if (added) {
      toast.success('Producto agregado al carrito', {
        duration: 1000
      });
    } else {
      toast.warning('El producto ya está en tu carrito', {
        duration: 1600
      });
    }
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-[350px] web:md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <Image source={{ uri: product.image_url }} className="h-20 w-20 rounded-xl shadow mt-2" />
        </DialogHeader>
        <View className="mt-2">
          <Text className="font-semibold mb-1">Notas</Text>
          <Input
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ej: Con poca sal, poco arroz, etc."
            className="w-full min-h-[60px] text-sm bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2"
            accessibilityLabel="Notas para el producto"
          />
        </View>
        <DialogFooter>
          <Button onPress={handleAddToCart} size="lg" className="w-full">
            <Text className="font-semibold">Agregar al carrito</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}