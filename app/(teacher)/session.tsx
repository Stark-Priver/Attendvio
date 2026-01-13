/**
 * Teacher Session Screen - Create and manage sessions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';
import CustomDateTimePicker from '@/components/ui/custom-date-time-picker';
import { sessionAPI } from '@/utils/api';
import { getCurrentLocation } from '@/utils/location';
import { Colors, Typography, Spacing } from '@/constants/design';

export default function TeacherSessionScreen() {
  const [formData, setFormData] = useState({
    subject_name: '',
    radius: '50',
    start_time: new Date(),
    end_time: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  });

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    // Get current location on mount
    (async () => {
      try {
        const loc = await getCurrentLocation();
        if (loc) {
          setLocation(loc);
        }
      } catch {
        setToast({ visible: true, message: 'Failed to get location', type: 'error' });
      }
    })();
  }, []);

  const handleCreateSession = async () => {
    // Validation
    if (!formData.subject_name.trim()) {
      setToast({ visible: true, message: 'Please enter a subject name', type: 'error' });
      return;
    }

    if (!location) {
      setToast({ visible: true, message: 'Location not available', type: 'error' });
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setToast({ visible: true, message: 'End time must be after start time', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await sessionAPI.createSession({
        subject_name: formData.subject_name,
        latitude: location.latitude,
        longitude: location.longitude,
        radius: parseInt(formData.radius),
        start_time: formData.start_time.toISOString(),
        end_time: formData.end_time.toISOString(),
      });

      setToast({ visible: true, message: 'Session created successfully', type: 'success' });
      
      // Reset form
      setFormData({
        subject_name: '',
        radius: '50',
        start_time: new Date(),
        end_time: new Date(Date.now() + 60 * 60 * 1000),
      });

      // Navigate back to sessions
      setTimeout(() => {
        router.push('/(teacher)');
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Session Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject Name *</Text>
            <Input
              placeholder="e.g., Mathematics 101"
              value={formData.subject_name}
              onChangeText={(text) => setFormData({ ...formData, subject_name: text })}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Geofence Radius (meters) *</Text>
            <Input
              placeholder="50"
              value={formData.radius}
              onChangeText={(text) => setFormData({ ...formData, radius: text })}
              keyboardType="numeric"
              editable={!loading}
            />
            <Text style={styles.helperText}>Students must be within this radius to mark attendance</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Session Timing</Text>

          <View style={styles.formGroup}>
            <CustomDateTimePicker
              value={formData.start_time}
              onChange={(date) => setFormData({ ...formData, start_time: date })}
              mode="datetime"
              label="Start Time *"
            />
          </View>

          <View style={styles.formGroup}>
            <CustomDateTimePicker
              value={formData.end_time}
              onChange={(date) => setFormData({ ...formData, end_time: date })}
              mode="datetime"
              label="End Time *"
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>

          {location ? (
            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={20} color={Colors.success} />
                <View style={styles.locationText}>
                  <Text style={styles.locationLabel}>Latitude</Text>
                  <Text style={styles.locationValue}>{location.latitude.toFixed(6)}</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={20} color={Colors.success} />
                <View style={styles.locationText}>
                  <Text style={styles.locationLabel}>Longitude</Text>
                  <Text style={styles.locationValue}>{location.longitude.toFixed(6)}</Text>
                </View>
              </View>
              <Text style={styles.helperText}>Session will be created at your current location</Text>
            </View>
          ) : (
            <View style={styles.locationError}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
              <Text style={styles.errorText}>Location not available</Text>
            </View>
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Creating Session...' : 'Create Session'}
            onPress={handleCreateSession}
            loading={loading}
            disabled={!location || loading}
          />
        </View>
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
    backgroundColor: Colors.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenHorizontal,
    paddingVertical: Spacing.base,
    gap: Spacing.base,
  },
  card: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
    marginBottom: Spacing.sm,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  helperText: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
  },
  locationInfo: {
    gap: Spacing.base,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.success + '10',
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
  },
  locationValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
  },
  locationError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.error + '10',
    borderRadius: 8,
  },
  errorText: {
    fontSize: Typography.fontSize.body,
    color: Colors.error,
    fontWeight: Typography.fontWeight.semibold,
  },
  buttonContainer: {
    paddingVertical: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
});
