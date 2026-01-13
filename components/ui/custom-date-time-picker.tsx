/**
 * Custom Date Time Picker - Attendvio Design System
 * Uses Poppins font and follows app design guidelines
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/design';

interface CustomDateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  label?: string;
}

export default function CustomDateTimePicker({
  value,
  onChange,
  mode = 'datetime',
  label,
}: CustomDateTimePickerProps) {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [selectedHour, setSelectedHour] = useState(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState(value.getMinutes());

  const handleConfirm = () => {
    const newDate = new Date(selectedDate);
    if (mode === 'time' || mode === 'datetime') {
      newDate.setHours(selectedHour);
      newDate.setMinutes(selectedMinute);
    }
    onChange(newDate);
    setVisible(false);
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleHourChange = (increment: number) => {
    let newHour = selectedHour + increment;
    if (newHour < 0) newHour = 23;
    if (newHour > 23) newHour = 0;
    setSelectedHour(newHour);
  };

  const handleMinuteChange = (increment: number) => {
    let newMinute = selectedMinute + increment;
    if (newMinute < 0) newMinute = 59;
    if (newMinute > 59) newMinute = 0;
    setSelectedMinute(newMinute);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date, hour: number, minute: number) => {
    return `${formatDate(date)} ${formatTime(hour, minute)}`;
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={20} color={Colors.darkBlue} />
        <Text style={styles.buttonText}>
          {mode === 'time'
            ? formatTime(value.getHours(), value.getMinutes())
            : mode === 'date'
            ? formatDate(value)
            : formatDateTime(value, value.getHours(), value.getMinutes())}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select {mode === 'time' ? 'Time' : 'Date & Time'}</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.confirmButton}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerContainer} showsVerticalScrollIndicator={false}>
              {/* Date Picker */}
              {(mode === 'date' || mode === 'datetime') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Date</Text>
                  <View style={styles.datePickerContainer}>
                    <TouchableOpacity
                      style={styles.arrowButton}
                      onPress={() => handleDateChange(-1)}
                    >
                      <Ionicons name="chevron-back" size={24} color={Colors.darkBlue} />
                    </TouchableOpacity>

                    <View style={styles.dateDisplay}>
                      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.arrowButton}
                      onPress={() => handleDateChange(1)}
                    >
                      <Ionicons name="chevron-forward" size={24} color={Colors.darkBlue} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Time Picker */}
              {(mode === 'time' || mode === 'datetime') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Time</Text>
                  <View style={styles.timePickerContainer}>
                    {/* Hours */}
                    <View style={styles.timeColumn}>
                      <TouchableOpacity
                        style={styles.timeArrowButton}
                        onPress={() => handleHourChange(1)}
                      >
                        <Ionicons name="chevron-up" size={24} color={Colors.darkBlue} />
                      </TouchableOpacity>

                      <View style={styles.timeDisplay}>
                        <Text style={styles.timeText}>{String(selectedHour).padStart(2, '0')}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.timeArrowButton}
                        onPress={() => handleHourChange(-1)}
                      >
                        <Ionicons name="chevron-down" size={24} color={Colors.darkBlue} />
                      </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    <Text style={styles.timeSeparator}>:</Text>

                    {/* Minutes */}
                    <View style={styles.timeColumn}>
                      <TouchableOpacity
                        style={styles.timeArrowButton}
                        onPress={() => handleMinuteChange(1)}
                      >
                        <Ionicons name="chevron-up" size={24} color={Colors.darkBlue} />
                      </TouchableOpacity>

                      <View style={styles.timeDisplay}>
                        <Text style={styles.timeText}>{String(selectedMinute).padStart(2, '0')}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.timeArrowButton}
                        onPress={() => handleMinuteChange(-1)}
                      >
                        <Ionicons name="chevron-down" size={24} color={Colors.darkBlue} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins_600SemiBold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  buttonText: {
    flex: 1,
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.darkBlue,
    fontFamily: 'Poppins_500Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: Spacing.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  modalTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
    fontFamily: 'Poppins_600SemiBold',
  },
  cancelButton: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    fontFamily: 'Poppins_500Medium',
  },
  confirmButton: {
    fontSize: Typography.fontSize.body,
    color: Colors.orange,
    fontWeight: Typography.fontWeight.semibold,
    fontFamily: 'Poppins_600SemiBold',
  },
  pickerContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.base,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
    fontFamily: 'Poppins_600SemiBold',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplay: {
    flex: 1,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.darkBlue,
    fontFamily: 'Poppins_600SemiBold',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  timeColumn: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timeArrowButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeDisplay: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    fontFamily: 'Poppins_700Bold',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.darkBlue,
    marginBottom: Spacing.base,
    fontFamily: 'Poppins_700Bold',
  },
});
