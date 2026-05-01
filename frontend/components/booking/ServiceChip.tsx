import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ServiceChipProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const ServiceChip: React.FC<ServiceChipProps> = ({ label, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: '45%',
    flexGrow: 1,
  },
  chipSelected: {
    borderColor: '#c0392b',
    backgroundColor: '#fff0f0',
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#c0392b',
    fontWeight: 'bold',
  },
});
