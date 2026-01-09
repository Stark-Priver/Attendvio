/**
 * Register Screen
 * Clean registration flow
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

type Role = 'STUDENT' | 'TEACHER';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as Role,
    studentId: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as const });

  const handleRegister = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setToast({ visible: true, message: 'Please fill all required fields', type: 'error' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ visible: true, message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setToast({ visible: true, message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    if (formData.role === 'STUDENT' && !formData.studentId) {
      setToast({ visible: true, message: 'Student ID is required', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        role: formData.role,
        student_id: formData.role === 'STUDENT' ? formData.studentId.trim() : undefined,
        department: formData.department.trim() || undefined,
      });

      // Navigate based on role
      if (response.user.role === 'TEACHER') {
        router.replace('/(teacher)');
      } else {
        router.replace('/(student)');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your details to continue</Text>
        </Animated.View>

        {/* Role Selection */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.roleContainer}>
          <Pressable
            style={[
              styles.roleButton,
              formData.role === 'STUDENT' && styles.roleButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, role: 'STUDENT' })}>
            <Ionicons
              name="school"
              size={24}
              color={formData.role === 'STUDENT' ? Colors.white : Colors.darkBlue}
            />
            <Text
              style={[
                styles.roleText,
                formData.role === 'STUDENT' && styles.roleTextActive,
              ]}>
              Student
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.roleButton,
              formData.role === 'TEACHER' && styles.roleButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, role: 'TEACHER' })}>
            <Ionicons
              name="person"
              size={24}
              color={formData.role === 'TEACHER' ? Colors.white : Colors.darkBlue}
            />
            <Text
              style={[
                styles.roleText,
                formData.role === 'TEACHER' && styles.roleTextActive,
              ]}>
              Teacher
            </Text>
          </Pressable>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                autoCapitalize="words"
              />
            </View>
          </View>

          <Input
            label="Email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {formData.role === 'STUDENT' && (
            <Input
              label="Student ID"
              placeholder="STU001"
              value={formData.studentId}
              onChangeText={(text) => setFormData({ ...formData, studentId: text })}
              autoCapitalize="characters"
            />
          )}

          <Input
            label="Department (Optional)"
            placeholder="Computer Science"
            value={formData.department}
            onChangeText={(text) => setFormData({ ...formData, department: text })}
          />

          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
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

          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showPassword}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.link}>Sign In</Text>
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
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
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
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  roleButtonActive: {
    backgroundColor: Colors.darkBlue,
    borderColor: Colors.darkBlue,
  },
  roleText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
  },
  roleTextActive: {
    color: Colors.white,
  },
  form: {
    gap: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
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
