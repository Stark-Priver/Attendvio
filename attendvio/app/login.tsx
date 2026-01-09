/**
 * Login Screen
 * Clean, minimal authentication screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';
import { authAPI } from '@/utils/api';
import { Colors, Typography, Spacing } from '@/constants/design';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as const });

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({ visible: true, message: 'Please fill all fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email.trim().toLowerCase(), password);
      
      // Navigate based on role
      if (response.user.role === 'TEACHER') {
        router.replace('/(teacher)');
      } else {
        router.replace('/(student)');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      setToast({ visible: true, message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="calendar" size={40} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.title}>Attendvio</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.form}>
          <Input
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </Pressable>
            }
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.link}>Sign Up</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.screenHorizontal,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl * 2,
    paddingBottom: Spacing.xxxl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSize.largeTitle,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
    marginBottom: Spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
  },
  form: {
    gap: Spacing.base,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.orange,
  },
});
