import { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Product } from "@/types";
import { useCartStore } from "@/store";
import { toast } from "sonner-native";

// Opciones fijas, puedes moverlas a un archivo de constantes luego
const SAUCES = [
  { id: "mayonesa", name: "Mayonesa" },
  { id: "ketchup", name: "Ketchup" },
  { id: "mostaza", name: "Mostaza" },
  { id: "bbq", name: "BBQ" },
];
const SIDES = [
  { id: "sin_ensalada", name: "Sin ensalada" },
  { id: "sin_papas", name: "Sin papas" },
];


interface BurgerCustomizationModalProps {
  show: boolean;
  onClose: () => void;
  product: Product;
}

export const BurgerCustomizationModal = ({ show, onClose, product }: BurgerCustomizationModalProps) => {
  const { addItem } = useCartStore();
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Limpia los estados al cerrar el modal
  useEffect(() => {
    if (!show) {
      setSelectedSauces([]);
      setSelectedSides([]);
    }
  }, [show]);

  const handleToggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  };

  const handleAddToCart = () => {
    const added = addItem({
      ...product,
      quantity: 1,
      customizations: {
        sauces: selectedSauces,
        sides: selectedSides,
      },
    });
    setSelectedSauces([]);
    setSelectedSides([]);
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
          <Image source={{ uri: product.image_url }} className="h-20 w-20 mt-2 rounded-xl shadow" />
        </DialogHeader>
        <View className="gap-4">
          {/* Salsas */}
          <Text className="font-semibold mt-2">Cremas</Text>
          <View className="flex-row flex-wrap gap-2">
            {SAUCES.map(sauce => (
              <Button
                key={sauce.id}
                variant={selectedSauces.includes(sauce.id) ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onPress={() => handleToggle(selectedSauces, setSelectedSauces, sauce.id)}
                accessibilityLabel={`Seleccionar ${sauce.name}`}
              >
                <Text>{sauce.name}</Text>
              </Button>
            ))}
          </View>
          {/* Papas */}
          <Text className="font-semibold mt-4">Extras</Text>
          <View className="flex-row gap-2">
            {SIDES.map(side => (
              <Button
                key={side.id}
                variant={selectedSides.includes(side.id) ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onPress={() => handleToggle(selectedSides, setSelectedSides, side.id)}
                accessibilityLabel={`Seleccionar ${side.name}`}
              >
                <Text>{side.name}</Text>
              </Button>
            ))}
          </View>


        </View>
        <DialogFooter>
          <Button onPress={handleAddToCart} size="lg" className="w-full">
            <Text className="font-semibold">Agregar al carrito</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
