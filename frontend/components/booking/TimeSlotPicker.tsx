import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.slot, isSelected && styles.slotSelected]}
              onPress={() => onSelectSlot(slot)}
              activeOpacity={0.8}
            >
              <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  slotSelected: {
    backgroundColor: '#0d0d0f',
    borderColor: '#0d0d0f',
  },
  slotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  slotTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
