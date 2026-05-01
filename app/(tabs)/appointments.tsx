import { API } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// ─── Data Types ───────────────────────────────────────────────────────────────

type VehicleServiceRequest = {
  _id: string;
  customerDetails: {
    fullName: string;
    contactNumber: string;
  };
  vehicleDetails: {
    category: string;
    brand: string;
    model: string;
    regNumber: string;
  };
  serviceDetails: {
    serviceType: string;
    preferredDate: string;
    preferredTimeSlot: string;
    issueDescription: string;
  };
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
};

const STATUS_STYLE: Record<VehicleServiceRequest['status'], { bg: string; text: string }> = {
  Pending: { bg: '#fef9c3', text: '#854d0e' },
  Confirmed: { bg: '#dcfce7', text: '#166534' },
  'In Progress': { bg: '#eff6ff', text: '#1e40af' },
  Completed: { bg: '#f3f4f6', text: '#374151' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<VehicleServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(API.vehicleService);
      const data = await response.json();
      if (response.ok) {
        setAppointments(data);
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const handleNewAppointment = () => {
    router.push('/add-vehicle');
  };

  const handleViewDetails = (item: VehicleServiceRequest) => {
    Alert.alert(
      `${item.vehicleDetails.brand} ${item.vehicleDetails.model}`,
      `Service: ${item.serviceDetails.serviceType}\n` +
      `Date: ${new Date(item.serviceDetails.preferredDate).toLocaleDateString()}\n` +
      `Time: ${item.serviceDetails.preferredTimeSlot || 'Not specified'}\n` +
      `Status: ${item.status}\n\n` +
      `Issue: ${item.serviceDetails.issueDescription || 'No description'}`
    );
  };

  const handleReschedule = () => {
    Linking.openURL('tel:0755004004');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Appointments</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Manage your service appointments
          </ThemedText>
        </ThemedView>

        {/* New Appointment Button */}
        <Pressable
          style={({ pressed }) => [styles.newApptBtn, pressed && { opacity: 0.85 }]}
          onPress={handleNewAppointment}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.newApptBtnText}>Book New Appointment</Text>
        </Pressable>

        {/* Upcoming Section */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>All Requests</ThemedText>
            {loading && <ActivityIndicator size="small" color="#dc2626" />}
          </View>

          {!loading && appointments.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No appointments found.</Text>
            </View>
          )}

          {appointments.map((appt) => {
            const statusStyle = STATUS_STYLE[appt.status] || STATUS_STYLE.Pending;
            return (
              <View key={appt._id} style={styles.apptCard}>
                {/* Card Top */}
                <View style={styles.apptCardTop}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold" style={styles.apptName}>
                      {appt.serviceDetails.serviceType}
                    </ThemedText>
                    <Text style={styles.apptVehicle}>
                      {appt.vehicleDetails.brand} {appt.vehicleDetails.model} ({appt.vehicleDetails.regNumber})
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {appt.status}
                    </Text>
                  </View>
                </View>

                {/* Date & Time */}
                <View style={styles.apptMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                    <ThemedText style={styles.metaText}>
                      {new Date(appt.serviceDetails.preferredDate).toLocaleDateString()}
                    </ThemedText>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#6b7280" />
                    <ThemedText style={styles.metaText}>
                      {appt.serviceDetails.preferredTimeSlot || 'Flexible'}
                    </ThemedText>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.apptActions}>
                  <Pressable
                    style={({ pressed }) => [styles.actionBtnPrimary, pressed && { opacity: 0.85 }]}
                    onPress={() => handleViewDetails(appt)}>
                    <Text style={styles.actionBtnPrimaryText}>View Details</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.actionBtnSecondary, pressed && { opacity: 0.85 }]}
                    onPress={handleReschedule}>
                    <Text style={styles.actionBtnSecondaryText}>Support</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ThemedView>

        {/* Need Help Block */}
        <View style={styles.helpCard}>
          <ThemedText type="defaultSemiBold" style={styles.helpTitle}>Need Help?</ThemedText>
          <Pressable
            style={styles.helpRow}
            onPress={() => Linking.openURL('tel:0755004004')}>
            <Ionicons name="call-outline" size={16} color="#dc2626" />
            <ThemedText style={styles.helpText}>Call us: 0755 004 004</ThemedText>
          </Pressable>
          <View style={styles.helpRow}>
            <Ionicons name="location-outline" size={16} color="#dc2626" />
            <ThemedText style={styles.helpText}>MotoHub Service Center</ThemedText>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6b7280',
  },
  newApptBtn: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newApptBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  section: {
    gap: 14,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 12,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 15,
  },
  apptCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  apptCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  apptName: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  apptVehicle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  apptMeta: {
    gap: 6,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#6b7280',
    fontSize: 13,
  },
  apptActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  actionBtnSecondary: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnSecondaryText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  helpCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 10,
    marginBottom: 16,
  },
  helpTitle: {
    color: '#111827',
    fontSize: 15,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpText: {
    color: '#374151',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 24,
  },
});
