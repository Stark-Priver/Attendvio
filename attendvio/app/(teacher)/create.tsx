/**
 * Create Session Screen - Teacher Only
 * Form to create new attendance session
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Toast } from '@/components/ui/toast';
import { sessionAPI } from '@/utils/api';
import { getCurrentLocation } from '@/utils/location';
import { Colors, Typography, Spacing } from '@/constants/design';

export default function CreateSessionScreen() {
  const [formData, setFormData] = useState({
    subjectName: '',
    radius: '50',
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const handleGetLocation = async () => {
    setGettingLocation(true);
    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        setToast({ visible: true, message: 'Location captured', type: 'success' });
      } else {
        setToast({ visible: true, message: 'Failed to get location', type: 'error' });
      }
    } catch {
      setToast({ visible: true, message: 'Location access denied', type: 'error' });
    } finally {
      setGettingLocation(false);
    }
  };

  const handleCreateSession = async () => {
    // Validation
    if (!formData.subjectName.trim()) {
      setToast({ visible: true, message: 'Please enter subject name', type: 'error' });
      return;
    }

    if (!location) {
      setToast({ visible: true, message: 'Please capture location', type: 'error' });
      return;
    }

    const radius = parseInt(formData.radius);
    if (isNaN(radius) || radius < 10 || radius > 1000) {
      setToast({ visible: true, message: 'Radius must be between 10-1000m', type: 'error' });
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setToast({ visible: true, message: 'End time must be after start time', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await sessionAPI.createSession({
        subject_name: formData.subjectName.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius,
        start_time: formData.startTime.toISOString(),
        end_time: formData.endTime.toISOString(),
      });

      setToast({ visible: true, message: 'Session created successfully', type: 'success' });
      
      // Reset form
      setTimeout(() => {
        setFormData({
          subjectName: '',
          radius: '50',
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        });
        setLocation(null);
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create session';
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
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.title}>New Session</Text>
          <Text style={styles.subtitle}>
            Create an attendance session with geofencing
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.form}>
          
          <Input
            label="Subject Name"
            placeholder="e.g., Mobile App Development"
            value={formData.subjectName}
            onChangeText={(text) => setFormData({ ...formData, subjectName: text })}
          />

          {/* Location */}
          <View>
            <Text style={styles.label}>Session Location</Text>
            {location ? (
              <Card style={styles.locationCard}>
                <View style={styles.locationInfo}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                  <View style={styles.locationText}>
                    <Text style={styles.locationTitle}>Location Captured</Text>
                    <Text style={styles.locationCoords}>
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>
                <Button
                  title="Update"
                  onPress={handleGetLocation}
                  loading={gettingLocation}
                  variant="secondary"
                />
              </Card>
            ) : (
              <Card style={styles.locationCard}>
                <View style={styles.locationInfo}>
                  <Ionicons name="location" size={24} color={Colors.textSecondary} />
                  <View style={styles.locationText}>
                    <Text style={styles.locationTitle}>No Location Set</Text>
                    <Text style={styles.locationDesc}>
                      Students must be within the specified radius
                    </Text>
                  </View>
                </View>
                <Button
                  title="Capture Location"
                  onPress={handleGetLocation}
                  loading={gettingLocation}
                />
              </Card>
            )}
          </View>

          <Input
            label="Radius (meters)"
            placeholder="50"
            value={formData.radius}
            onChangeText={(text) => setFormData({ ...formData, radius: text })}
            keyboardType="numeric"
          />

          {/* Time Selection */}
          <View>
            <Text style={styles.label}>Start Time</Text>
            <Button
              title={formData.startTime.toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              onPress={() => setShowStartPicker(true)}
              variant="secondary"
            />
            {showStartPicker && (
              <DateTimePicker
                value={formData.startTime}
                mode="datetime"
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setFormData({ ...formData, startTime: date });
                }}
              />
            )}
          </View>

          <View>
            <Text style={styles.label}>End Time</Text>
            <Button
              title={formData.endTime.toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              onPress={() => setShowEndPicker(true)}
              variant="secondary"
            />
            {showEndPicker && (
              <DateTimePicker
                value={formData.endTime}
                mode="datetime"
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setFormData({ ...formData, endTime: date });
                }}
              />
            )}
          </View>

          <View style={styles.createButtonContainer}>
            <Button
              title="Create Session"
              onPress={handleCreateSession}
              loading={loading}
            />
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
  title: {
    fontSize: Typography.fontSize.largeTitle,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  locationCard: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  locationDesc: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
  },
  locationCoords: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  createButtonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
});
