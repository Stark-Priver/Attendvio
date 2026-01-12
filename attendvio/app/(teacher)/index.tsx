/**
 * Teacher Home - My Sessions Screen
 */

import React, { useState, useEffect } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert as RNAlert,
  Text,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Toast } from '@/components/ui/toast';
import { sessionAPI } from '@/utils/api';
import { Colors, Typography, Spacing } from '@/constants/design';


interface Session {
  id: number;
  subject_name: string;
  start_time: string;
  end_time: string;
  radius: number;
  status: string;
  attendance_count?: number;
}

export default function TeacherHomeScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [endingSession, setEndingSession] = useState<number | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const loadSessions = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await sessionAPI.getSessions();
      setSessions(response);
    } catch {
      setToast({ visible: true, message: 'Failed to load sessions', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // Load sessions on initial mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Reload sessions every time the tab is focused
  useFocusEffect(
    React.useCallback(() => {
      loadSessions();
    }, [])
  );

  const handleEndSession = (session: Session) => {
    RNAlert.alert(
      'End Session',
      `Are you sure you want to end "${session.subject_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            setEndingSession(session.id);
            try {
              await sessionAPI.endSession(session.id);
              setToast({ visible: true, message: 'Session ended successfully', type: 'success' });
              loadSessions();
            } catch {
              setToast({ visible: true, message: 'Failed to end session', type: 'error' });
            } finally {
              setEndingSession(null);
            }
          },
        },
      ]
    );
  };

  // Render a single session card
  const renderSession = ({ item }: { item: Session }) => (
    <Animated.View entering={FadeInDown}>
      <Card style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="book-outline" size={32} color={Colors.darkBlue} />
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>{item.subject_name}</Text>
            <Text style={styles.sessionStatus}>{item.status}</Text>
          </View>
          {typeof item.attendance_count === 'number' && (
            <View style={styles.countBadge}>
              <Ionicons name="person-outline" size={16} color={Colors.darkBlue} />
              <Text style={styles.countText}>{item.attendance_count}</Text>
            </View>
          )}
        </View>
        <View style={styles.sessionDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {new Date(item.start_time).toLocaleString()} - {new Date(item.end_time).toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailText}>Radius: {item.radius}m</Text>
          </View>
        </View>
        {item.status !== 'ended' && (
          <Button
            title={endingSession === item.id ? 'Ending...' : 'End Session'}
            onPress={() => handleEndSession(item)}
            variant="danger"
            loading={endingSession === item.id}
          />
        )}
      </Card>
    </Animated.View>
  );

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
            <Text style={styles.emptyTitle}>No Sessions Yet</Text>
            <Text style={styles.emptyText}>
              Create your first attendance session to get started
            </Text>
          </View>
        }
        ListFooterComponent={
          sessions.length > 0 ? (
            <View style={styles.footerButton}>
              <Button
                title="Create New Session"
                onPress={() => router.push('./session')}
              />
            </View>
          ) : null
        }
      />

      {sessions.length === 0 && (
        <View style={styles.floatingButton}>
          <Button
            title="Create Session"
            onPress={() => router.push('./session')}
          />
        </View>
      )}

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
  sessionStatus: {
    fontSize: Typography.fontSize.caption1,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.darkBlue + '10',
    borderRadius: 12,
  },
  countText: {
    fontSize: Typography.fontSize.caption1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
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
  footerButton: {
    padding: Spacing.screenHorizontal,
    paddingVertical: Spacing.base,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    left: Spacing.screenHorizontal,
    right: Spacing.screenHorizontal,
  },
});
