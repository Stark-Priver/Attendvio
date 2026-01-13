/**
 * Input Component
 * Clean iOS-style text input
 */

import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/constants/design';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={icon ? [styles.input, styles.inputWithIcon] : [styles.input]}
          placeholderTextColor={Colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Layout.inputHeight,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  inputContainerFocused: {
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.white,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  iconContainer: {
    paddingLeft: Spacing.base,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: Spacing.base,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  inputWithIcon: {
    paddingLeft: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
