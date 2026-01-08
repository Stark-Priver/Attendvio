/**
 * Mark Attendance Screen - Critical geofencing implementation
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Button, Card } from '../../components';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceSession } from '../../types';
import { Colors, Typography, Spacing } from '../../theme';

interface Props {
  route: { params: { session: AttendanceSession } };
  navigation: any;
}

const MarkAttendanceScreen: React.FC<Props> = ({ route, navigation }) => {
  const { session } = route.params;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to mark attendance',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setGettingLocation(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMarkAttendance = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Calculate distance locally (for user feedback)
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        parseFloat(session.latitude),
        parseFloat(session.longitude)
      );

      // Backend will validate again
      await attendanceService.markAttendance({
        session_id: session.id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert(
        'Success',
        'Attendance marked successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert(
        'Failed',
        error.response?.data?.error || 'Could not mark attendance. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (gettingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  const distance = location
    ? calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        parseFloat(session.latitude),
        parseFloat(session.longitude)
      )
    : null;

  const isWithinRange = distance !== null && distance <= session.radius;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{session.subject_name}</Text>
        <Text style={styles.teacher}>by {session.teacher_name}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Session Time</Text>
          <Text style={styles.infoValue}>
            {new Date(session.start_time).toLocaleTimeString()} - {new Date(session.end_time).toLocaleTimeString()}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Allowed Radius</Text>
          <Text style={styles.infoValue}>{session.radius} meters</Text>
        </View>

        {location && (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Your Distance</Text>
            <Text
              style={[
                styles.infoValue,
                isWithinRange ? styles.distanceSuccess : styles.distanceError,
              ]}
            >
              {distance?.toFixed(2)} meters
            </Text>
          </View>
        )}

        {!isWithinRange && distance !== null && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              You are outside the allowed area. Please move closer to the session location.
            </Text>
          </View>
        )}

        <Button
          title="Mark Attendance"
          onPress={handleMarkAttendance}
          disabled={!isWithinRange || loading}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.cancelButton}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray.light,
    padding: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  card: {
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  teacher: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  infoSection: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  distanceSuccess: {
    color: Colors.success,
  },
  distanceError: {
    color: Colors.error,
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    padding: Spacing.md,
    marginVertical: Spacing.md,
    borderRadius: 8,
  },
  warningText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
  },
  button: {
    marginTop: Spacing.md,
  },
  cancelButton: {
    marginTop: Spacing.sm,
  },
});

export default MarkAttendanceScreen;
