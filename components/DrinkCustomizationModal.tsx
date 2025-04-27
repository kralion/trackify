import { useState, useEffect } from "react";
import { toast } from "sonner-native";
import { Image, View } from "react-native";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Product } from "@/types";
import { useCartStore } from "@/store";



const BRANDHALFLITER = [
  { id: "coca_cola", name: "Coca Cola", price: 4 },
  { id: "inca_kola", name: "Inca Kola", price: 4 },
  { id: "sprite", name: "Sprite", price: 3 },
  { id: "fanta", name: "Fanta", price: 3 }
];
const BRANDLITERANDHALF = [
  { id: "coca_cola", name: "Coca Cola", price: 10 },
  { id: "inca_kola", name: "Inca Kola", price: 10 },
];

const BRANDS2LITERS = [
  { id: "coca_cola", name: "Coca Cola", price: 12 },
  { id: "inca_kola", name: "Inca Kola", price: 12 },
];

const TEMPERATURE = [
  { id: "helada", name: "Helada" },
  { id: "regular", name: "Regular" },
];

const getBrandsByProductId = (id: number) => {
  if (id === 75) return BRANDHALFLITER;
  if (id === 73) return BRANDLITERANDHALF;
  if (id === 72) return BRANDS2LITERS;
  return [];
};

interface DrinkCustomizationModalProps {
  show: boolean;
  onClose: () => void;
  product: Product;
}

export const DrinkCustomizationModal = ({ show, onClose, product }: DrinkCustomizationModalProps) => {
  const { addItem } = useCartStore();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedTemperature, setSelectedTemperature] = useState<string | null>(null);

  const brands = getBrandsByProductId(product.id);

  useEffect(() => {
    if (!show) {
      setSelectedBrand(null);
    }
  }, [show]);

  const handleAddToCart = () => {
    if (!selectedBrand) return;
    const brandObj = brands.find(b => b.id === selectedBrand);
    const added = addItem({
      ...product,
      quantity: 1,
      customizations: {
        Marca: brandObj ? brandObj.name : "",
      },
      price: brandObj ? brandObj.price : product.price,
    });
    setSelectedBrand(null);
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
          <DialogTitle>Bebida {product.name}</DialogTitle>

        </DialogHeader>
        <View className="flex flex-row items-start gap-4">
          <Image source={{ uri: product.image_url }} className="h-20 w-20 rounded-xl shadow" />

        </View>
        <View className="gap-4">
          <Text className="font-semibold mt-2">Marca</Text>
          <View className="flex-row flex-wrap gap-2">
            {brands.map(brand => (
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
