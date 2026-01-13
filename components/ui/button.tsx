/**
 * Primary Button Component
 * iOS-style button with smooth press animation
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Animation } from '@/constants/design';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, Animation.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Animation.spring);
  };

  const getBackgroundColor = () => {
    if (disabled) return Colors.disabledBackground;
    if (variant === 'primary') return Colors.darkBlue;
    if (variant === 'secondary') return Colors.white;
    if (variant === 'danger') return Colors.error;
    return Colors.darkBlue;
  };

  const getTextColor = () => {
    if (disabled) return Colors.disabled;
    if (variant === 'secondary') return Colors.darkBlue;
    return Colors.white;
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.secondaryButton,
        fullWidth && styles.fullWidth,
        animatedStyle,
      ]}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.darkBlue,
  },
  text: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: -0.3,
  },
});
