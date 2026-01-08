/**
 * Student Dashboard Screen
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
import { attendanceService } from '../../services/attendanceService';
import { DashboardStats, AttendanceSession } from '../../types';
import { Colors, Typography, Spacing } from '../../theme';

const StudentDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dashboardData, sessionsData] = await Promise.all([
        reportService.getStudentDashboard(),
        sessionService.getActiveSessions(),
      ]);
      setStats(dashboardData);
      setActiveSessions(sessionsData);
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
          <Text style={styles.role}>Student - {user?.student_id}</Text>
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
            <Text style={styles.statValue}>{stats?.statistics.total_attendance || 0}</Text>
            <Text style={styles.statLabel}>Total Attendance</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{activeSessions.length}</Text>
            <Text style={styles.statLabel}>Active Sessions</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {activeSessions.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>No active sessions at the moment</Text>
            </Card>
          ) : (
            activeSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                onPress={() => navigation.navigate('MarkAttendance', { session })}
              >
                <Card style={styles.sessionCard}>
                  <Text style={styles.sessionTitle}>{session.subject_name}</Text>
                  <Text style={styles.teacherName}>by {session.teacher_name}</Text>
                  <Text style={styles.sessionTime}>
                    Ends at {new Date(session.end_time).toLocaleTimeString()}
                  </Text>
                  <View style={styles.markButton}>
                    <Text style={styles.markButtonText}>Mark Attendance</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('AttendanceHistory')}
        >
          <Text style={styles.historyButtonText}>View Attendance History</Text>
        </TouchableOpacity>
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
  sessionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  teacherName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  sessionTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  markButton: {
    backgroundColor: Colors.secondary,
    padding: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  markButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  historyButton: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  historyButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default StudentDashboardScreen;
