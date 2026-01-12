/**
 * Student Home - Active Sessions Screen
 * Shows geofence-enabled attendance sessions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
} from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Toast } from '@/components/ui/toast';
import CheckInSuccessAnimation from '@/components/ui/check-in-success';
import { sessionAPI, attendanceAPI } from '@/utils/api';
import { getCurrentLocation, isWithinGeofence } from '@/utils/location';
import { Colors, Typography, Spacing } from '@/constants/design';

interface Session {
  id: number;
  subject_name: string;
  teacher_name: string;
  start_time: string;
  end_time: string;
  latitude: number;
  longitude: number;
  radius: number;
  status: string;
}

export default function StudentHomeScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState<number | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const loadSessions = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await sessionAPI.getActiveSessions();
      setSessions(response);
    } catch {
      setToast({ visible: true, message: 'Failed to load sessions', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleMarkAttendance = async (session: Session) => {
    setMarkingAttendance(session.id);

    try {
      // Get current location
      const location = await getCurrentLocation();
      if (!location) {
        setToast({ visible: true, message: 'Location access denied', type: 'error' });
        return;
      }

      // Check geofence
      const { withinRange, distance } = isWithinGeofence(
        location.latitude,
        location.longitude,
        session.latitude,
        session.longitude,
        session.radius
      );

      if (!withinRange) {
        setToast({
          visible: true,
          message: `You are ${distance}m away. Required: ${session.radius}m`,
          type: 'error',
        });
        return;
      }

      // Mark attendance
      await attendanceAPI.markAttendance({
        session_id: session.id,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setToast({ visible: true, message: 'Attendance marked successfully', type: 'success' });
      loadSessions();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to mark attendance';
      setToast({ visible: true, message, type: 'error' });
    } finally {
      setMarkingAttendance(null);
    }
  };

  const renderSession = ({ item, index }: { item: Session; index: number }) => {
    const startTime = new Date(item.start_time);
    const endTime = new Date(item.end_time); // Used for display only

    return (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
        <Card style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="book" size={24} color={Colors.darkBlue} />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>{item.subject_name}</Text>
              <Text style={styles.teacherName}>{item.teacher_name}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>

          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailText}>Within {item.radius}m radius</Text>
            </View>
          </View>

          <Button
            title={markingAttendance === item.id ? 'Marking...' : 'Mark Attendance'}
            onPress={() => handleMarkAttendance(item)}
            loading={markingAttendance === item.id}
          />
        </Card>
      </Animated.View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading sessions..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSessions(true)}
            tintColor={Colors.darkBlue}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Active Sessions</Text>
            <Text style={styles.emptyText}>
              There are no active attendance sessions at the moment
            </Text>
          </View>
        }
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  listContent: {
    padding: Spacing.screenHorizontal,
    gap: Spacing.base,
  },
  sessionCard: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
    marginBottom: 2,
  },
  teacherName: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.success + '15',
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: Typography.fontSize.caption1,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.success,
  },
  sessionDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    gap: Spacing.base,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.title3,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  emptyText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
});
