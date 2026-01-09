/**
 * Animation utilities for Attendvio
 * Smooth, fast, purposeful animations following iOS design principles
 */

import { useEffect } from 'react';
import { useSharedValue, withTiming, withSpring, withSequence, Easing } from 'react-native-reanimated';
import { Animation } from '@/constants/design';

// Fade animation hook
export const useFadeIn = (duration = Animation.duration.normal) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  return opacity;
};

// Slide from bottom animation
export const useSlideIn = (duration = Animation.duration.normal) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  return { translateY, opacity };
};

// Scale animation hook (for button presses)
export const useScale = (pressed: boolean) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(pressed ? 0.96 : 1, {
      damping: Animation.spring.damping,
      stiffness: Animation.spring.stiffness,
      mass: Animation.spring.mass,
    });
  }, [pressed]);

  return scale;
};

// Success animation (subtle scale + fade)
export const successAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  scale.value = withSequence(
    withTiming(1.05, { duration: 150 }),
    withTiming(1, { duration: 150 })
  );

  return { scale, opacity };
};

// Pulse animation (for loading states)
export const usePulse = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    const animate = () => {
      opacity.value = withSequence(
        withTiming(0.5, { duration: 800 }),
        withTiming(1, { duration: 800 })
      );
    };

    const interval = setInterval(animate, 1600);
    animate();

    return () => clearInterval(interval);
  }, []);

  return opacity;
};

// Staggered list animation
export const useStaggeredAnimation = (index: number, delay = 50) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const animationDelay = index * delay;

    setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: Animation.duration.normal,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: Animation.duration.normal,
        easing: Easing.out(Easing.cubic),
      });
    }, animationDelay);
  }, [index]);

  return { opacity, translateY };
};

// Shake animation (for errors)
export const shakeAnimation = () => {
  const translateX = useSharedValue(0);

  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );

  return translateX;
};

// Screen transition animations
export const screenTransitionConfig = {
  animation: 'timing' as const,
  config: {
    duration: Animation.duration.normal,
    easing: Easing.out(Easing.cubic),
  },
};
