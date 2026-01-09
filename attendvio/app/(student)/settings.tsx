/**
 * Settings Screen - iOS Style
 * Clean, grouped list layout
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SettingsItem } from '@/components/ui/settings-item';
import { SectionHeader } from '@/components/ui/section-header';
import { authAPI } from '@/utils/api';
import { Colors, Spacing } from '@/constants/design';

export default function SettingsScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await authAPI.getCurrentUser();
    setUser(userData);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await authAPI.logout();
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <SectionHeader title="Profile" />
      <View style={styles.section}>
        <SettingsItem
          icon="person-circle"
          iconColor={Colors.darkBlue}
          title={user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
          subtitle={user?.email}
          showChevron={false}
        />
        {user?.role === 'STUDENT' && user?.student_id && (
          <View style={styles.separator} />
        )}
        {user?.role === 'STUDENT' && user?.student_id && (
          <SettingsItem
            icon="card"
            iconColor={Colors.orange}
            title="Student ID"
            value={user.student_id}
            showChevron={false}
          />
        )}
        {user?.department && (
          <>
            <View style={styles.separator} />
            <SettingsItem
              icon="school"
              iconColor="#34C759"
              title="Department"
              value={user.department}
              showChevron={false}
            />
          </>
        )}
      </View>

      {/* Account Section */}
      <SectionHeader title="Account" />
      <View style={styles.section}>
        <SettingsItem
          icon="shield-checkmark"
          iconColor="#5856D6"
          title="Privacy"
          onPress={() => {}}
        />
        <View style={styles.separator} />
        <SettingsItem
          icon="notifications"
          iconColor="#FF9500"
          title="Notifications"
          onPress={() => {}}
        />
      </View>

      {/* App Section */}
      <SectionHeader title="About" />
      <View style={styles.section}>
        <SettingsItem
          icon="information-circle"
          iconColor={Colors.darkBlue}
          title="About Attendvio"
          subtitle="Version 1.0.0"
          onPress={() => {}}
        />
        <View style={styles.separator} />
        <SettingsItem
          icon="help-circle"
          iconColor="#5AC8FA"
          title="Help & Support"
          onPress={() => {}}
        />
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <View style={styles.section}>
          <SettingsItem
            title="Sign Out"
            onPress={handleLogout}
            showChevron={false}
            destructive
          />
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: Spacing.screenHorizontal,
    overflow: 'hidden',
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.separator,
    marginLeft: Spacing.screenHorizontal + 48,
  },
  logoutContainer: {
    marginTop: Spacing.xl,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
});
