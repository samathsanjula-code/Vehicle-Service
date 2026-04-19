import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { DUMMY_SERVICES, updateServiceRecord, ServiceRecord } from '@/constants/service-data/dummyData';

export default function AdminUpdateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [service, setService] = useState<ServiceRecord | null>(null);

  const [status, setStatus] = useState<'Completed' | 'Pending'>('Pending');
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState('');
  const [nextDate, setNextDate] = useState('');

  useEffect(() => {
    const s = DUMMY_SERVICES.find(record => record.id === id);
    if (s) {
      setService(s);
      setStatus(s.status);
      setNotes(s.notes);
      setParts(s.partsUsed.join(', '));
      setNextDate(s.nextServiceDate);
    }
  }, [id]);

  const handleSave = () => {
    if (!service) return;

    const partsArray = parts.split(',').map(p => p.trim()).filter(p => p.length > 0);

    updateServiceRecord(service.id, {
      status,
      notes,
      partsUsed: partsArray,
      nextServiceDate: nextDate,
    });

    Alert.alert('Success', 'Service record updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  if (!service) {
    return (
      <View style={styles.center}>
        <Text>Loading or Not Found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerInfo}>
          <Text style={styles.serviceId}>Record ID: {service.id}</Text>
          <Text style={styles.serviceTitle}>{service.serviceType}</Text>
          <Text style={styles.customerText}>{service.customerName} - {service.vehicle}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity
              style={[styles.statusButton, status === 'Pending' && styles.statusPendingActive]}
              onPress={() => setStatus('Pending')}
            >
              <Text style={[styles.statusButtonText, status === 'Pending' && styles.statusTextActive]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, status === 'Completed' && styles.statusCompletedActive]}
              onPress={() => setStatus('Completed')}
            >
              <Text style={[styles.statusButtonText, status === 'Completed' && styles.statusTextActive]}>Completed</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Enter service notes here..."
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Parts Used (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={parts}
            onChangeText={setParts}
            placeholder="e.g. Engine Oil, Oil Filter"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Next Service Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={nextDate}
            onChangeText={setNextDate}
            placeholder="e.g. 2026-10-15"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  customerText: {
    fontSize: 14,
    color: '#666',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  statusPendingActive: {
    backgroundColor: '#FEF7E0',
    borderColor: '#B06000',
  },
  statusCompletedActive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#137333',
  },
  statusTextActive: {
    color: '#1A1A1A',
  },
  saveButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
