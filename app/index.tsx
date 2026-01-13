/**
 * Splash Screen - Calm, Premium, Minimal
 * Dark blue background with simple icon
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authAPI } from '@/utils/api';
import { Colors, Typography, Spacing } from '@/constants/design';

export default function SplashScreen() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Wait minimum time for splash
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const user = await authAPI.getCurrentUser();
      
      if (user) {
        // Navigate based on role
        if (user.role === 'TEACHER') {
          router.replace({ pathname: '/(teacher)' as any });
        } else {
          router.replace({ pathname: '/(student)' as any });
        }
      } else {
        router.replace({ pathname: '/login' });
      }
    } catch (error) {
      router.replace({ pathname: '/login' });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(600)}
        exiting={FadeOut.duration(400)}
        style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={64} color={Colors.white} />
        </View>
        <Text style={styles.title}>Attendvio</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white + '20',
  },
  title: {
    fontSize: 42,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    letterSpacing: -1.5,
  },
});
