/**
 * Card Component
 * Clean iOS-style card with subtle shadow
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/design';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  noPadding = false,
  animated = false,
}) => {
  const Container = animated ? Animated.View : View;
  const animationProps = animated ? { entering: FadeIn.duration(300) } : {};

  return (
    <Container
      style={[
        styles.card,
        !noPadding && styles.cardPadding,
        style,
      ]}
      {...animationProps}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    ...Shadows.small,
  },
  cardPadding: {
    padding: Spacing.base,
  },
});
