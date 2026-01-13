/**
 * iOS-style Settings List Item
 * Clean, minimal, tap-to-navigate item
 */

import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Layout } from '@/constants/design';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SettingsItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor = Colors.darkBlue,
  title,
  subtitle,
  value,
  onPress,
  showChevron = true,
  destructive = false,
}) => {
  const backgroundColor = useSharedValue<string>(Colors.white);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value as string,
  }));

  const handlePressIn = () => {
    backgroundColor.value = withTiming(Colors.backgroundSecondary, { duration: 100 });
  };

  const handlePressOut = () => {
    backgroundColor.value = withTiming(Colors.white, { duration: 100 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      style={[styles.container, animatedStyle]}>
      <View style={styles.leftSection}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <Ionicons name={icon} size={20} color={Colors.white} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, destructive && styles.destructive]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightSection}>
        {value && <Text style={styles.value}>{value}</Text>}
        {showChevron && onPress && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Layout.listItemMinHeight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.regular,
  },
  subtitle: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  destructive: {
    color: Colors.error,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  value: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
  },
});
