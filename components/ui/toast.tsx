/**
 * Toast notification component
 * Subtle, calm feedback messages
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, ZIndex } from '@/constants/design';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
      opacity.value = withSpring(1);

      // Auto-hide after 3 seconds
      setTimeout(() => {
        translateY.value = withSpring(-100);
        opacity.value = withSpring(0);
        setTimeout(onHide, 300);
      }, 3000);
    }
    }, [visible, onHide, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getBackgroundColor = () => {
    if (type === 'success') return Colors.success;
    if (type === 'error') return Colors.error;
    return Colors.darkBlue;
  };

  const getIcon = () => {
    if (type === 'success') return 'checkmark-circle';
    if (type === 'error') return 'close-circle';
    return 'information-circle';
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        animatedStyle,
      ]}>
      <Ionicons name={getIcon()} size={20} color={Colors.white} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.screenHorizontal,
    right: Spacing.screenHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
    zIndex: ZIndex.toast,
  },
  message: {
    flex: 1,
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
});
