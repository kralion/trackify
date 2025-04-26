import { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Product } from "@/types";
import { useCartStore } from "@/store";

const BRANDS = [
  { id: "coca_cola", name: "CocaCola", price: 15 },
  { id: "fanta", name: "Fanta", price: 13 },
  { id: "pepsi", name: "Pepsi", price: 12 },
];

interface DrinkCustomizationModalProps {
  show: boolean;
  onClose: () => void;
  product: Product;
}

export const DrinkCustomizationModal = ({ show, onClose, product }: DrinkCustomizationModalProps) => {
  const { addItem } = useCartStore();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    if (!show) {
      setSelectedBrand(null);
    }
  }, [show]);

  const handleAddToCart = () => {
    if (!selectedBrand) return;
    const brandObj = BRANDS.find(b => b.id === selectedBrand);
    addItem({
      ...product,
      quantity: 1,
      customizations: {
        brand: brandObj ? brandObj.name : "",
      },
      price: brandObj ? brandObj.price : product.price,
    });
    setSelectedBrand(null);
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-[350px] web:md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bebida {product.name}</DialogTitle>

        </DialogHeader>
        <View className="flex flex-row items-start gap-4">
          <Image source={{ uri: product.image_url }} className="h-20 w-20 rounded-xl shadow" />

        </View>
        <View className="gap-4">
          <Text className="font-semibold mt-2">Marca</Text>
          <View className="flex-row flex-wrap gap-2">
            {BRANDS.map(brand => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onPress={() => setSelectedBrand(brand.id)}
                accessibilityLabel={`Seleccionar ${brand.name}`}
              >
                <Text>{brand.name} - S/.{brand.price.toFixed(2)}</Text>
              </Button>
            ))}
          </View>
        </View>
        <DialogFooter>
          <Button onPress={handleAddToCart} size="lg" className="w-full" disabled={!selectedBrand}>
            <Text className="font-semibold">Agregar al carrito</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
