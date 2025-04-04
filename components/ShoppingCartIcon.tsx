import { useCartStore } from '@/store';
import { router } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

const ShoppingCartIcon: React.FC = () => {
  const cartItems = useCartStore((state) => state.items);

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <TouchableOpacity
      hitSlop={8}
      onPress={() =>
        cartItemsCount === 0
          ? toast.warning('Selecciona al menos un producto')
          : router.push('/(auth)/(screens)/cart')
      }>
      <View style={styles.container}>
        <ShoppingCart
          color="black"
          size={24}
        />
        {cartItemsCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'black',

              borderRadius: 12,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#FFD500', fontSize: 12, fontWeight: 'bold' }}>
              {cartItems.length}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default ShoppingCartIcon;
