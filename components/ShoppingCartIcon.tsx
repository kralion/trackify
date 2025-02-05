import { useCartStore } from '@/store';
import { router } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ShoppingCartIcon: React.FC = () => {
  const cartItemCount = useCartStore((state) => state.itemCount);

  return (
    <TouchableOpacity onPress={() => router.push('/(auth)/(screens)/cart')}>
      <View style={styles.container}>
        <ShoppingCart color="#FFD500" size={24} />
        {cartItemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItemCount}</Text>
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
  badge: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShoppingCartIcon;
