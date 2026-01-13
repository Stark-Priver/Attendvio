/**
 * Check-in Success Animation Modal
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/design';

interface CheckInSuccessProps {
  visible: boolean;
  onHide: () => void;
}

export default function CheckInSuccessAnimation({ visible, onHide }: CheckInSuccessProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Reset values
      scale.value = 0;
      opacity.value = 0;
      checkmarkScale.value = 0;

      // Animate in
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, {
        damping: 8,
        mass: 1,
        stiffness: 100,
      });

      // Checkmark animation
      checkmarkScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.2, {
          damping: 6,
          mass: 1,
          stiffness: 120,
        }),
        withSpring(1, {
          damping: 8,
          mass: 1,
          stiffness: 100,
        })
      );

      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        setTimeout(onHide, 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, scale, opacity, checkmarkScale, onHide]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.container}>
        <Animated.View style={[styles.animationContainer, containerAnimatedStyle]}>
          <View style={styles.circle}>
            <Animated.View style={[styles.checkmarkContainer, checkmarkAnimatedStyle]}>
              <Ionicons name="checkmark" size={80} color={Colors.white} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
