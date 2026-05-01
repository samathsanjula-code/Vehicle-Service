import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, Linking, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBookings, Booking } from '@/hooks/useBookings';
import { useAuth } from '../../context/AuthContext';

// ─── Data ────────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: '#dcfce7', text: '#166534' },
  Pending: { bg: '#fef9c3', text: '#854d0e' },
  'Pending Payment': { bg: '#fef3c7', text: '#d97706' },
  Completed: { bg: '#f3f4f6', text: '#374151' },
  Cancelled: { bg: '#fce8e6', text: '#d93025' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const { fetchUserBookings, deleteBooking, loading, error } = useBookings();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Booking[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadBookings();
      }
    }, [user])
  );

  const loadBookings = async () => {
    try {
      if (!user) return;
      const data = await fetchUserBookings(user.id);
      setUpcomingAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewAppointment = () => {
    router.push('/booking/create');
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Ionicons name="lock-closed-outline" size={64} color="#d1d5db" />
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 16, marginBottom: 8 }}>Login Required</Text>
          <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>Please log in to view and manage your appointments.</Text>
          <Pressable
            style={({ pressed }) => [styles.newApptBtn, pressed && { opacity: 0.85 }, { alignSelf: 'stretch' }]}
            onPress={() => router.push('/(auth)/login')}>
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.newApptBtnText}>Go to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBooking(id);
              loadBookings();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete appointment');
            }
          }
        }
      ]
    );
  };

  const handleViewDetails = (item: Booking) => {
    router.push(`/booking/${item._id}`);
  };

  const handleReschedule = (item: Booking) => {
    router.push(`/booking/reschedule/${item._id}`);
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
          <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming</ThemedText>

          {loading ? (
            <ActivityIndicator size="large" color="#dc2626" />
          ) : error ? (
            <Text style={{ color: '#dc2626', textAlign: 'center' }}>{error}</Text>
          ) : upcomingAppointments.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 10 }}>No appointments found.</Text>
          ) : (
            upcomingAppointments.map((appt) => {
              const statusStyle = STATUS_STYLE[appt.status] || { bg: '#f3f4f6', text: '#374151' };
              return (
                <View key={appt._id} style={styles.apptCard}>
                  {/* Card Top */}
                  <View style={styles.apptCardTop}>
                    <ThemedText type="defaultSemiBold" style={styles.apptName}>
                      {Array.isArray(appt.serviceType) ? appt.serviceType.join(', ') : appt.serviceType}
                    </ThemedText>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {appt.status}
                      </Text>
                    </View>
                  </View>

                  {/* Date & Time & Price */}
                  <View style={styles.apptMeta}>
                    <View style={styles.metaRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                      <ThemedText style={styles.metaText}>{new Date(appt.scheduledDate).toLocaleDateString()}</ThemedText>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <ThemedText style={styles.metaText}>{appt.scheduledTime}</ThemedText>
                    </View>
                    {appt.price ? (
                      <View style={styles.metaRow}>
                        <Ionicons name="cash-outline" size={14} color="#166534" />
                        <ThemedText style={[styles.metaText, { color: '#166534', fontWeight: 'bold' }]}>
                          LKR {appt.price}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>

                  {/* Actions */}
                  <View style={styles.apptActions}>
                    <Pressable
                      style={({ pressed }) => [styles.actionBtnPrimary, pressed && { opacity: 0.85 }]}
                      onPress={() => handleViewDetails(appt)}>
                      <Text style={styles.actionBtnPrimaryText}>View Details</Text>
                    </Pressable>
                    
                    {appt.status === 'Pending' && (
                      <>
                        <Pressable
                          style={({ pressed }) => [styles.actionBtnSecondary, pressed && { opacity: 0.85 }]}
                          onPress={() => router.push({ pathname: '/booking/create', params: { editBookingId: appt._id } })}>
                          <Text style={styles.actionBtnSecondaryText}>Edit</Text>
                        </Pressable>
                        <Pressable
                          style={({ pressed }) => [styles.actionBtnDanger, pressed && { opacity: 0.85 }]}
                          onPress={() => handleDelete(appt._id)}>
                          <Text style={styles.actionBtnDangerText}>Delete</Text>
                        </Pressable>
                      </>
                    )}
                    {appt.status === 'Pending Payment' && (
                      <Pressable
                        style={({ pressed }) => [styles.actionBtnSecondary, pressed && { opacity: 0.85 }]}
                        onPress={() => handleReschedule(appt)}>
                        <Text style={styles.actionBtnSecondaryText}>Reschedule</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
          )}
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
  sectionTitle: {
    color: '#111827',
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
  actionBtnDanger: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnDangerText: {
    color: '#dc2626',
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
