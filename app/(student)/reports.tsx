/**
 * Student Reports Screen - View attendance history and reports
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Share,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Toast } from '@/components/ui/toast';
import { sessionAPI, attendanceAPI } from '@/utils/api';
import { Colors, Typography, Spacing } from '@/constants/design';

interface AttendanceRecord {
  id: number;
  session_id: number;
  subject_name: string;
  teacher_name: string;
  marked_at: string;
  distance_from_center: number;
  is_verified: boolean;
}

export default function StudentReportsScreen() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const [stats, setStats] = useState({
    total_attendance: 0,
  });

  const loadAttendance = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await attendanceAPI.getMyAttendance();
      setAttendance(response);
      setStats({
        total_attendance: response.length,
      });
    } catch {
      setToast({ visible: true, message: 'Failed to load attendance records', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleExportData = async () => {
    try {
      if (attendance.length === 0) {
        setToast({ visible: true, message: 'No attendance records to export', type: 'info' });
        return;
      }

      // Create CSV content
      const headers = ['Subject', 'Teacher', 'Marked At', 'Distance (m)', 'Verified'];
      const rows = attendance.map(record => [
        record.subject_name,
        record.teacher_name,
        new Date(record.marked_at).toLocaleString(),
        record.distance_from_center.toFixed(2),
        record.is_verified ? 'Yes' : 'No',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      // Share the CSV
      await Share.share({
        message: csvContent,
        title: 'Attendance Report',
        url: undefined,
      });

      setToast({ visible: true, message: 'Report exported successfully', type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: 'Failed to export report', type: 'error' });
    }
  };

  const renderAttendanceRecord = ({ item, index }: { item: AttendanceRecord; index: number }) => {
    const markedDate = new Date(item.marked_at);

    return (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
        <Card style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.is_verified ? 'checkmark-circle' : 'ellipse'}
                size={24}
                color={item.is_verified ? Colors.success : Colors.warning}
              />
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.subjectName}>{item.subject_name}</Text>
              <Text style={styles.teacherName}>{item.teacher_name}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.is_verified ? Colors.success + '15' : Colors.warning + '15' }]}>
              <Text style={[styles.statusText, { color: item.is_verified ? Colors.success : Colors.warning }]}>
                {item.is_verified ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>

          <View style={styles.recordDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {markedDate.toLocaleDateString()} {markedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {item.distance_from_center.toFixed(2)}m from center
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading attendance records..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="checkmark-done-outline" size={32} color={Colors.darkBlue} />
            <Text style={styles.statValue}>{stats.total_attendance}</Text>
            <Text style={styles.statLabel}>Total Attendance</Text>
          </View>
        </Card>
      </View>

      <FlatList
        data={attendance}
        renderItem={renderAttendanceRecord}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAttendance(true)}
            tintColor={Colors.darkBlue}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Attendance Records</Text>
            <Text style={styles.emptyText}>
              Your attendance records will appear here
            </Text>
          </View>
        }
        ListFooterComponent={
          attendance.length > 0 ? (
            <View style={styles.footerButton}>
              <Button
                title="Export as CSV"
                onPress={handleExportData}
                variant="secondary"
              />
            </View>
          ) : null
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
  statsContainer: {
    padding: Spacing.screenHorizontal,
    paddingBottom: Spacing.base,
  },
  statCard: {
    padding: Spacing.base,
  },
  statContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.fontSize.title1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
  },
  statLabel: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.screenHorizontal,
    gap: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  recordCard: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  recordHeader: {
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
  recordInfo: {
    flex: 1,
  },
  subjectName: {
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Typography.fontSize.caption1,
    fontWeight: Typography.fontWeight.semibold,
  },
  recordDetails: {
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
  footerButton: {
    padding: Spacing.screenHorizontal,
    paddingBottom: Spacing.xxxl,
  },
});
