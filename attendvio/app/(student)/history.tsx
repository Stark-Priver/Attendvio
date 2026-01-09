/**
 * Student Attendance History Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { attendanceAPI } from '@/utils/api';
import { Colors, Typography, Spacing } from '@/constants/design';

interface AttendanceRecord {
  id: number;
  session_name: string;
  marked_at: string;
  distance_from_center: number;
}

export default function HistoryScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await attendanceAPI.getMyAttendance();
      setRecords(response);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const renderRecord = ({ item, index }: { item: AttendanceRecord; index: number }) => {
    const markedDate = new Date(item.marked_at);
    const today = new Date();
    const isToday = markedDate.toDateString() === today.toDateString();

    return (
      <Animated.View entering={FadeInDown.delay(index * 30).duration(400)}>
        <Card style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.sessionName}>{item.session_name}</Text>
              <View style={styles.recordDetails}>
                <Text style={styles.dateText}>
                  {isToday
                    ? `Today, ${markedDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : markedDate.toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                </Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.distanceText}>{item.distance_from_center}m away</Text>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading history..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadHistory(true)}
            tintColor={Colors.darkBlue}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Attendance Records</Text>
            <Text style={styles.emptyText}>
              Your attendance history will appear here
            </Text>
          </View>
        }
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
    gap: Spacing.md,
  },
  recordCard: {
    padding: Spacing.base,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  recordDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.textTertiary,
  },
  distanceText: {
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
