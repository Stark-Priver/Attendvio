/**
 * Section Header Component
 * iOS-style section headers for grouped lists
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/design';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return <Text style={styles.header}>{title.toUpperCase()}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.screenHorizontal,
    letterSpacing: 0.5,
  },
});
