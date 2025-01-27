import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    bottom: 16,
    justifyContent: 'center',
    left: 48,
    minHeight: 60,
    paddingVertical: 16,
    position: 'absolute',
    right: 48,
  },
});

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  testID?: string;
};

export const Bubble = ({ onPress, children, style, testID }: Props) => {
  const innerChildView = onPress ? (
    <TouchableOpacity onPress={onPress} testID={testID}>
      {children}
    </TouchableOpacity>
  ) : (
    children
  );

  return <View style={styles.container}>{innerChildView}</View>;
};
