/**
 * Teacher Reports Screen - View and export session attendance reports
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
  Modal,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Toast } from '@/components/ui/toast';
import { sessionAPI } from '@/utils/api';
import { Colors, Typography, Spacing } from '@/constants/design';
import api from '@/utils/api';

interface Session {
  id: number;
  subject_name: string;
  start_time: string;
  end_time: string;
  status: string;
  attendance_count?: number;
}

interface AttendanceRecord {
  student_id: string;
  student_name: string;
  email: string;
  department: string;
  marked_at: string;
  distance: number;
  is_verified: boolean;
}

interface SessionReport {
  session: Session;
  statistics: {
    total_attendance: number;
    verified_attendance: number;
    unverified_attendance: number;
  };
  attendees: AttendanceRecord[];
}

export default function TeacherReportsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
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

  useEffect(() => {
    loadSessions();
  }, []);

  const handleViewReport = async (session: Session) => {
    setReportLoading(true);
    try {
      const response = await api.get(`/reports/session/${session.id}/`);
      setSelectedSession(response.data);
    } catch {
      setToast({ visible: true, message: 'Failed to load session report', type: 'error' });
    } finally {
      setReportLoading(false);
    }
  };

  const handleExportCSV = async (session: Session) => {
    try {
      const response = await api.get(`/reports/session/${session.id}/export/`, {
        responseType: 'blob',
      });

      // Create a blob URL and share
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      await Share.share({
        message: `Attendance report for ${session.subject_name}`,
        title: `Attendance_${session.id}.csv`,
        url: url,
      });

      setToast({ visible: true, message: 'Report exported successfully', type: 'success' });
    } catch {
      setToast({ visible: true, message: 'Failed to export report', type: 'error' });
    }
  };

  const renderSession = ({ item, index }: { item: Session; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Card style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={24} color={Colors.darkBlue} />
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
              {new Date(item.start_time).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="View Report"
            onPress={() => handleViewReport(item)}
            variant="secondary"
          />
          <Button
            title="Export CSV"
            onPress={() => handleExportCSV(item)}
            variant="secondary"
          />
        </View>
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
            <Ionicons name="document-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Sessions</Text>
            <Text style={styles.emptyText}>
              Create a session to view attendance reports
            </Text>
          </View>
        }
      />

      <Modal
        visible={!!selectedSession}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedSession(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Button
              title="Close"
              onPress={() => setSelectedSession(null)}
              variant="secondary"
            />
            <Text style={styles.modalTitle}>Attendance Report</Text>
            <View style={{ width: 60 }} />
          </View>

          {reportLoading ? (
            <LoadingSpinner message="Loading report..." />
          ) : selectedSession ? (
            <ScrollView style={styles.reportContent}>
              <Card style={styles.reportCard}>
                <Text style={styles.reportSectionTitle}>Session Details</Text>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Subject:</Text>
                  <Text style={styles.reportValue}>{selectedSession.session.subject_name}</Text>
                </View>
                <View style={styles.reportRow}>
                  <Text style={styles.reportLabel}>Status:</Text>
                  <Text style={styles.reportValue}>{selectedSession.session.status}</Text>
                </View>
              </Card>

              <Card style={styles.reportCard}>
                <Text style={styles.reportSectionTitle}>Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{selectedSession.statistics.total_attendance}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: Colors.success }]}>
                      {selectedSession.statistics.verified_attendance}
                    </Text>
                    <Text style={styles.statLabel}>Verified</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: Colors.warning }]}>
                      {selectedSession.statistics.unverified_attendance}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.reportCard}>
                <Text style={styles.reportSectionTitle}>Attendees</Text>
                {selectedSession.attendees.length > 0 ? (
                  selectedSession.attendees.map((attendee, index) => (
                    <View key={index} style={styles.attendeeRow}>
                      <View style={styles.attendeeInfo}>
                        <Text style={styles.attendeeName}>{attendee.student_name}</Text>
                        <Text style={styles.attendeeDetail}>{attendee.student_id}</Text>
                        <Text style={styles.attendeeDetail}>{attendee.department}</Text>
                      </View>
                      <View style={styles.attendeeStatus}>
                        <Ionicons
                          name={attendee.is_verified ? 'checkmark-circle' : 'ellipse'}
                          size={20}
                          color={attendee.is_verified ? Colors.success : Colors.warning}
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noAttendeesText}>No attendance records</Text>
                )}
              </Card>

              <View style={styles.reportFooter}>
                <Button
                  title="Export as CSV"
                  onPress={() => {
                    handleExportCSV(selectedSession.session);
                    setSelectedSession(null);
                  }}
                />
              </View>
            </ScrollView>
          ) : null}
        </View>
      </Modal>

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
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  modalTitle: {
    fontSize: Typography.fontSize.title3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
  },
  reportContent: {
    flex: 1,
    padding: Spacing.screenHorizontal,
  },
  reportCard: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  reportSectionTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
    marginBottom: Spacing.base,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  reportLabel: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  reportValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.base,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: Typography.fontSize.title2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
  },
  statLabel: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  attendeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
  },
  attendeeDetail: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  attendeeStatus: {
    marginLeft: Spacing.base,
  },
  noAttendeesText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.base,
  },
  reportFooter: {
    paddingVertical: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
});
