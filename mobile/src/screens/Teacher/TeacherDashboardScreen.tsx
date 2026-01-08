/**
 * Teacher Dashboard Screen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Card, Loading } from '../../components';
import { reportService } from '../../services/reportService';
import { sessionService } from '../../services/sessionService';
import { DashboardStats, AttendanceSession } from '../../types';
import { Colors, Typography, Spacing } from '../../theme';

const TeacherDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dashboardData, sessionsData] = await Promise.all([
        reportService.getTeacherDashboard(),
        sessionService.getSessions(),
      ]);
      setStats(dashboardData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.first_name}</Text>
          <Text style={styles.role}>Teacher</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.statistics.total_sessions || 0}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.statistics.active_sessions || 0}</Text>
            <Text style={styles.statLabel}>Active Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.statistics.total_attendance || 0}</Text>
            <Text style={styles.statLabel}>Total Attendance</Text>
          </Card>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateSession')}
        >
          <Text style={styles.createButtonText}>Create New Session</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Sessions</Text>
          {sessions.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>No sessions yet. Create your first session!</Text>
            </Card>
          ) : (
            sessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                onPress={() => navigation.navigate('SessionDetails', { sessionId: session.id })}
              >
                <Card style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionTitle}>{session.subject_name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        session.status === 'ACTIVE' && styles.statusActive,
                        session.status === 'ENDED' && styles.statusEnded,
                      ]}
                    >
                      <Text style={styles.statusText}>{session.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionTime}>
                    {new Date(session.start_time).toLocaleString()} - {new Date(session.end_time).toLocaleTimeString()}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  role: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs / 2,
  },
  logoutButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  logoutText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: Colors.secondary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  sessionCard: {
    marginBottom: Spacing.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sessionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.gray.medium,
  },
  statusActive: {
    backgroundColor: Colors.success,
  },
  statusEnded: {
    backgroundColor: Colors.gray.dark,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
  sessionTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
});

export default TeacherDashboardScreen;
