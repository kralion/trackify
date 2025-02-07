import { useCartStore } from '@/store';
import { router } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ShoppingCartIcon: React.FC = () => {
  const cartItems = useCartStore((state) => state.items);

  return (
    <TouchableOpacity hitSlop={8} onPress={() => router.push('/(auth)/(screens)/cart')}>
      <View style={styles.container}>
        <ShoppingCart color="#FFD500" size={24} />
        {cartItems.length > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#FFD500',

              borderRadius: 12,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold' }}>
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
